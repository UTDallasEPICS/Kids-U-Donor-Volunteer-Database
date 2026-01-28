import { NextResponse, NextRequest } from "next/server";
import { parse } from "csv-parse/sync";
import prisma from "@/app/utils/db";

type RecordType = {
  [key: string]: string | number | null;
};

function parseDate(value: any): Date | null {
  if (!value) return null;
  const d = new Date(String(value));
  return isNaN(d.getTime()) ? null : d;
}

function parseBoolean(value: any): boolean {
  if (value === null || value === undefined) return false;
  const str = String(value).toLowerCase().trim();
  const truthy = new Set(["true", "yes", "1", "y"]);
  const falsy = new Set(["false", "no", "0", "n"]);
  if (truthy.has(str)) return true;
  if (falsy.has(str)) return false;
  // Fallback: choose to return false or throw/log
  return false;
}

// Prefer Net Amount when present; fall back to Amount variants.
function pickAmountRaw(row: Record<string, any>): string {
  const get = (k: string) => {
    const v = row[k];
    if (v === undefined || v === null) return null;
    const s = String(v).trim();
    return s.length ? s : null;
  };

  const netKeys = [
    "Net Amount",
    "net amount",
    "Net amount",
    "netAmount",
    "NetAmount",
  ];
  for (const k of netKeys) {
    const v = get(k);
    if (v) return v;
  }

  const amountKeys = [
    "Amount",
    "amount",
    "Donation Amount",
    "Amount (total)",
    "Gift Amount",
  ];
  for (const k of amountKeys) {
    const v = get(k);
    if (v) return v;
  }
  return "0";
}

// Split a full name into first and last. Supports "Last, First ..." and "First ... Last".
function splitFullName(value: any): { first: string | null; last: string | null } {
  if (!value) return { first: null, last: null };
  const raw = String(value).trim().replace(/\s+/g, " ");
  if (!raw) return { first: null, last: null };
  if (raw.includes(",")) {
    const [lastPart, firstPartRaw] = raw.split(",", 2).map((s) => s.trim());
    const first = (firstPartRaw || "").split(" ")[0] || "";
    const last = lastPart || "";
    return { first: first || null, last: last || null };
  }
  const parts = raw.split(" ");
  if (parts.length === 1) return { first: parts[0] || null, last: null };
  const first = parts[0] || null;
  const last = parts[parts.length - 1] || null;
  return { first, last };
}


export async function POST(req: NextRequest) {
  try {
    // Ensure multipart/form-data
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 415 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("csv") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    let fileContent = await file.text();

    // Check for Venmo format: has "Account Statement -" or "Account Activity"
    const isVenmoFile = fileContent.includes("Account Statement -") || 
                         fileContent.includes("Account Activity");
    
    if (isVenmoFile) {
      const lines = fileContent.split("\n");
      // Skip first TWO rows (header rows), keep the rest
      // Row 0: "Account Statement - (@kids-u)"
      // Row 1: "Account Activity"
      // Row 2: Actual headers (Datetime, Type, Status, Note, From, To, Amount (total))
      fileContent = lines.slice(2).join("\n");
    }

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    });

    // Normalize keys & values
    const normalizedRecords: Record<string, any>[] = records.map((record: Record<string, any>) => {
      const normalizedRecord: Record<string, any> = {};
      for (const key in record) {
        // Trim whitespace and strip a leading UTF-8 BOM if present (affects first header when exported from Excel)
        const cleanedKey = key.trim().replace(/^\uFEFF/, "");
        const value = record[key];
        const cleanedValue = typeof value === "string" ? value.replace(/^\uFEFF/, "").trim() : value;
        normalizedRecord[cleanedKey] = cleanedValue;
      }
      return normalizedRecord;
    });

    const summary = {
      peopleCreated: 0,
      organizationsCreated: 0,
      donorsCreated: 0,
      donationsCreated: 0,
      errors: [] as string[],
    };

    for (let idx = 0; idx < normalizedRecords.length; idx++) {
      const row = normalizedRecords[idx];
      try {
        // Heuristics for donor info
        let personFirst = row["Donor First Name"] || row["firstName"] || row["First"] || row["First Name"] || null;
        let personLast = row["Donor Last Name"] || row["lastName"] || row["Last"] || row["Last Name"] || null;
        // If a consolidated "From" column exists, use it to fill missing first/last
        const fromFullName = row["From"] || row["from"] || null;
        if ((!personFirst || !personLast) && fromFullName) {
          const parsed = splitFullName(fromFullName);
          if (!personFirst && parsed.first) personFirst = parsed.first;
          if (!personLast && parsed.last) personLast = parsed.last;
        }
        const email = row["Email"] || row["Email Address"] || row["email"] || row["Donor Email"] || null;
        const phone = row["Contact Number"] || row["Phone Number"] || row["phone"] || row["Phone"] || null;
        const preferredContact = row["Preferred Contact Method"] || row["Preferred Contact"] || row["Contact Method"] || row["preferredContactMethod"] || row["contactMethod"] || null;
        const mailingAddress = row["Mailing Address"] || row["Address"] || row["address"] || row["Street Address"] || null;
        
        // Add default donor type if missing (assume Individual)
        if (!row["Donor Type"] && !row["Type"] && !row["type"]) {
          row["Donor Type"] = "Individual";
        }

        // Normalize type values
        let type = row["Donor Type"] || row["Type"] || row["type"] || "Individual";
        if (type != "Individual" && type != "individual" && type != "Corporate" && type != "corporate" && type != "In-Kind" && type != "In-kind" && type != "in-kind" && type != "In Kind" && type != "In kind" && type != "in kind") {
          type = "Individual";
        }

        // Organization fields
        const orgName = row["Organization"] || row["Organization Name"] || row["Company Name (if applicable)"] || row["Company"] || null;
        const orgEmail = email;

        // Donation fields
        const amountRaw = pickAmountRaw(row);
        const amount = Number(String(amountRaw).replace(/[^0-9.-]+/g, "")) || 0;
        const date = parseDate(row["Date"] || row["Donation Date"] || row["date"] || row["Datetime"]);
        const fund = row["Fund"] || row["Kids-U Program"] || row["fund"] || row["Fund Designation"] || null;
        const paymentMethod = row["Donation Method"] || row["paymentMethod"] || row["Payment Method"] || row["Payment Type"] || null;
        const isAnonymous = parseBoolean(row["Anonymous"] || row["anonymous"]);
        const campaign = row["Campaign/Event Name"] || row["campaign"] || row["Campaign"] || row["Event"] || null;
        const recurringFrequency = row["Donation Frequency"] || row["recurringFrequency"] || row["Frequency"] || row["Recurring"] || null;
        const acknowledgementSent = parseBoolean(row["Thank you/Follow Up Sent?"] || row["acknowledgementSent"] || row["Acknowledged"]);
        const receiptSent = parseBoolean(row["Receipt Sent"] || row["receiptSent"] || row["Receipt"]);
        const receiptNumber = row["Receipt Number"] || row["receiptNumber"] || row["Receipt ID"] || null;

        let donorId: string | null = null;

        

        // Individual donor logic
        if (type == "Individual" || type == "individual") {
          let person = null;
          if (email) {
            person = await prisma.person.findUnique({ where: { emailAddress: String(email) } }).catch(() => null);
          }
          if (!person && personFirst && personLast) {
            person = await prisma.person.findFirst({ where: { firstName: String(personFirst), lastName: String(personLast) } }).catch(() => null);
          }
          if (!person && personFirst && personLast) {
            person = await prisma.person.create({
              data: {
                firstName: String(personFirst),
                lastName: String(personLast),
                emailAddress: email ? String(email) : `${personFirst}.${personLast}@temp.com`,
                phoneNumber: phone ? String(phone) : undefined,
              },
            });
            summary.peopleCreated += 1;
          }

          if (person) {
            if (mailingAddress) {
              const existingAddress = await prisma.address.findUnique({ where: { personId: person.id } }).catch(() => null);
              if (!existingAddress) {
                await prisma.address.create({ data: { addressLine1: String(mailingAddress), addressLine2: null, city: "", state: "", zipCode: "", type: "Mailing", personId: person.id } }).catch(() => null);
              } else if (!existingAddress.addressLine1) {
                await prisma.address.update({ where: { id: existingAddress.id }, data: { addressLine1: String(mailingAddress) } }).catch(() => null);
              }
            }
            let donor = await prisma.donor.findUnique({ where: { personId: person.id } }).catch(() => null);
            if (!donor) {
              donor = await prisma.donor.create({ data: { type: type, communicationPreference: preferredContact ?? "", status: "Active", notes: "", isRetained: false, personId: person.id } });
              summary.donorsCreated += 1;
            }
            donorId = donor.id;
            if (
              preferredContact &&
              preferredContact !== donor.communicationPreference
            ) {
              await prisma.donor.update({
                where: { id: donor.id },
                data: { communicationPreference: String(preferredContact) },
              }).catch(() => null);
            }

          }

        } else if (type == "Corporate" || type == "corporate" || type == "In-Kind" || type == "In-kind" || type == "in-kind" || type == "In Kind" || type == "In kind" || type == "in kind") {
          let organization = null;
          if (orgName) {
            organization = await prisma.organization.findFirst({ where: { name: String(orgName) } }).catch(() => null);
          }
          if (!organization) {
            organization = await prisma.organization.findUnique({ where: { emailAddress: String(orgEmail) } }).catch(() => null);
          }
          if (!organization) {
            organization = await prisma.organization.create({ data: { name: String(orgName), emailAddress: orgEmail ? String(orgEmail) : email } });
            summary.organizationsCreated += 1;
          }
          if (mailingAddress) {
            const existingAddr = await prisma.address.findUnique({ where: { organizationId: organization.id } }).catch(() => null);
            if (!existingAddr) {
              await prisma.address.create({ data: { addressLine1: String(mailingAddress), addressLine2: null, city: "", state: "", zipCode: "", type: "Mailing", organizationId: organization.id } }).catch(() => null);
            } else if (!existingAddr.addressLine1) {
              await prisma.address.update({ where: { id: existingAddr.id }, data: { addressLine1: String(mailingAddress) } }).catch(() => null);
            }
          }
          // Ensure we also store a contact Person for organization-linked donors
          let contactPerson = null;
          if (personFirst || personLast || email) {
            if (email) {
              contactPerson = await prisma.person.findUnique({ where: { emailAddress: String(email) } }).catch(() => null);
            }
            if (!contactPerson && personFirst && personLast) {
              contactPerson = await prisma.person.findFirst({ where: { firstName: String(personFirst), lastName: String(personLast) } }).catch(() => null);
            }
            if (!contactPerson) {
              contactPerson = await prisma.person.create({
                data: {
                  firstName: personFirst ? String(personFirst) : (personLast ? String(personLast) : ""),
                  lastName: personLast ? String(personLast) : (personFirst ? String(personFirst) : ""),
                  emailAddress: email ? String(email) : `${(personFirst ?? "").toString().replace(/\s+/g, '')}.${(personLast ?? "").toString().replace(/\s+/g, '')}@temp.com`,
                  phoneNumber: phone ? String(phone) : undefined,
                },
              }).catch(() => null);
              if (contactPerson) summary.peopleCreated += 1;
            }

            // Attach mailing address to the contact person if provided and missing
            if (contactPerson && mailingAddress) {
              const existingPersonAddr = await prisma.address.findUnique({ where: { personId: contactPerson.id } }).catch(() => null);
              if (!existingPersonAddr) {
                await prisma.address.create({ data: { addressLine1: String(mailingAddress), addressLine2: null, city: "", state: "", zipCode: "", type: "Mailing", personId: contactPerson.id } }).catch(() => null);
              } else if (!existingPersonAddr.addressLine1) {
                await prisma.address.update({ where: { id: existingPersonAddr.id }, data: { addressLine1: String(mailingAddress) } }).catch(() => null);
              }
            }
          }

          let donor = await prisma.donor.findUnique({ where: { organizationId: organization.id } }).catch(() => null);
          if (!donor) {
            donor = await prisma.donor.create({ data: { type: type, communicationPreference: preferredContact ?? "", status: "Active", notes: "", isRetained: false, organizationId: organization.id, personId: contactPerson ? contactPerson.id : undefined } }).catch(() => null);
            if (donor) summary.donorsCreated += 1;
          } else {
            // DOES NOT WORK
            // if a donor exists for this organization but has no linked person (or linked person doesn't match what is stored in database), attach contactPerson
            if ((contactPerson && !donor.personId) || (contactPerson && donor.personId !== contactPerson.id)) {
              await prisma.donor.update({ where: { id: donor.id }, data: { personId: contactPerson.id } }).catch(() => null);
            }
          }
          donorId = donor ? donor.id : null;
        }

        // Create Donation record
        if (donorId && amount > 0) {
          await prisma.donation.create({
            data: {
              type: "Donation",
              amount: amount,
              item: null,
              paymentMethod: paymentMethod ?? null,
              campaign: campaign ?? null,
              fundDesignation: fund ?? "",
              recurringFrequency: recurringFrequency ?? null,
              date: date ?? new Date(),
              source: "import",
              isMatching: false,
              taxDeductibleAmount: amount,
              receiptSent: receiptSent,
              receiptNumber: receiptNumber ?? undefined,
              isAnonymous: isAnonymous,
              acknowledgementSent: acknowledgementSent,
              donorId: donorId,
            },
          });
          summary.donationsCreated += 1;
        } else if (donorId && amount <= 0) {
          summary.errors.push(`Row ${idx}: Donation amount must be greater than 0 (found: ${amount})`);
        } else if (!donorId && amount > 0) {
          summary.errors.push(`Row ${idx}: Could not create or find donor for donation amount ${amount}`);
        }
      } catch (recErr) {
        console.error(`Row ${idx} import error`, recErr);
        summary.errors.push(`Row ${idx}: ${String(recErr)}`);
      }
    }

    return NextResponse.json(
      { message: "CSV parsed and imported", summary, totalRowsProcessed: normalizedRecords.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
