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
    const fileContent = await file.text();

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    });

    // Normalize keys & values
    const normalizedRecords: Record<string, any>[] = records.map((record: Record<string, any>) => {
      const normalizedRecord: Record<string, any> = {};
      for (const key in record) {
        const trimmedKey = key.trim();
        const value = record[key];
        normalizedRecord[trimmedKey] = typeof value === "string" ? value.trim() : value;
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
        const personFirst = row["Donor First Name"] || row["firstName"] || row["First"] || row["First Name"] || null;
        const personLast = row["Donor Last Name"] || row["lastName"] || row["Last"] || row["Last Name"] || null;
        const email = row["Email"] || row["Email Address"] || row["email"] || row["Donor Email"] || null;
        const phone = row["Contact Number"] || row["Phone Number"] || row["phone"] || row["Phone"] || null;
        const preferredContact = row["Preferred Contact Method"] || row["Preferred Contact"] || row["Contact Method"] || row["preferredContactMethod"] || row["contactMethod"] || null;
        const mailingAddress = row["Mailing Address"] || row["Address"] || row["address"] || row["Street Address"] || null;
        const type = row["Donor Type"] || row["Type"] || row["donorType"] || row["type"] || null;

        // Organization fields
        const orgName = row["Organization"] || row["Organization Name"] || row["Company Name (if applicable)"] || row["Company"] || null;
        const orgEmail = email;

        // Donation fields
        const amountRaw = row["Amount"] || row["Donation Amount"] || row["amount"] || row["Gift Amount"] || "0";
        const amount = Number(String(amountRaw).replace(/[^0-9.-]+/g, "")) || 0;
        const date = parseDate(row["Date"] || row["Donation Date"] || row["date"] || row["Gift Date"]);
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

        } else if (type == "Corporate" || type == "corporate" || type == "In-Kind" || type == "In-kind" || type == "in-kind" || type == "In Kind" || type == "In kind" || type == "in kind" ) {
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
          let donor = await prisma.donor.findUnique({ where: { organizationId: organization.id } }).catch(() => null);
          if (!donor) {
            donor = await prisma.donor.create({ data: { type: type, communicationPreference: preferredContact ?? "", status: "Active", notes: "", isRetained: false, organizationId: organization.id } });
            summary.donorsCreated += 1;
          }
          donorId = donor.id;
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
