import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import prisma from "@/app/utils/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ error: "File must be a CSV file" }, { status: 400 });
    }

    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    let importedCount = 0;

    for (const record of records) {
      try {
        const supporterId = record["Supporter Id"] || "";
        const totalContributed = record["Total Contributed"]
          ? parseFloat(String(record["Total Contributed"]).replace(/[$,]/g, ""))
          : 0;
        const lastPaymentReceived = record["Last Payment Received"] ? new Date(record["Last Payment Received"]) : null;
        const notes = record["Notes"] || "";
        const tags = record["Tags"] || "";
        const anonymous = record["Anonymous?"] === "TRUE";

        // Create donor with all required fields including communicationPreference
        const donor = await prisma.donor.create({
          data: {
            type: "SUPPORTER",
            status: "ACTIVE",
            communicationPreference: "EMAIL", // Required field - default to email
            supporterId: supporterId,
            totalContributed: totalContributed,
            lastPaymentReceived: lastPaymentReceived,
            notes: notes,
            tags: tags,
            anonymous: anonymous,
          },
        });

        // Create person if email exists
        if (record["Email"]) {
          const existingPerson = await prisma.person.findFirst({
            where: { emailAddress: record["Email"] },
          });

          if (!existingPerson) {
            const person = await prisma.person.create({
              data: {
                firstName: record["First Name"] || record["Just First Name"] || "",
                lastName: record["Last Name"] || "",
                emailAddress: record["Email"] || "",
                phoneNumber: record["Phone"] || "",
              },
            });

            await prisma.donor.update({
              where: { id: donor.id },
              data: { personId: person.id },
            });
          } else {
            await prisma.donor.update({
              where: { id: donor.id },
              data: { personId: existingPerson.id },
            });
          }
        }

        // Create organization if provided
        if (record["Organization"]) {
          const existingOrg = await prisma.organization.findFirst({
            where: { name: record["Organization"] },
          });

          if (!existingOrg) {
            const org = await prisma.organization.create({
              data: { name: record["Organization"] },
            });

            await prisma.donor.update({
              where: { id: donor.id },
              data: { organizationId: org.id },
            });
          } else {
            await prisma.donor.update({
              where: { id: donor.id },
              data: { organizationId: existingOrg.id },
            });
          }
        }

        // Create donation if amount provided
        if (totalContributed > 0) {
          await prisma.donation.create({
            data: {
              donorId: donor.id,
              type: "SUPPORTER",
              amount: totalContributed,
              date: lastPaymentReceived || new Date(),
              source: "CSV_IMPORT",
              fundDesignation: "General Support",
              isMatching: false,
              isAnonymous: anonymous,
              acknowledgementSent: false,
            },
          });
        }

        importedCount++;
      } catch (error) {
        console.error("Error processing record:", error);
      }
    }

    // Return response immediately after processing
    const response = NextResponse.json(
      {
        message: `Successfully imported ${importedCount} supporters`,
        imported: importedCount,
        total: records.length,
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Error importing donors:", error);
    return NextResponse.json(
      { error: "Failed to import donors", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
