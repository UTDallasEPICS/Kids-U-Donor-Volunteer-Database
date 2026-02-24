import { NextResponse } from "next/server";
import prisma from "@/app/utils/db";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function fmtDate(d?: Date | null): string {
  if (!d) return "";
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(
      new Date(d)
    );
  } catch {
    return "";
  }
}

export async function GET() {
  try {
    const donors = await prisma.donor.findMany({
      include: {
        person: {
          include: { address: true },
        },
        organization: {
          include: { address: true },
        },
        donation: true,
      },
      orderBy: { id: "asc" },
    });

    const headers = [
      "Donor ID",
      "Donor Type",
      "First Name",
      "Last Name",
      "Email Address",
      "Phone Number",
      "Address",
      "City",
      "State",
      "Zip Code",
      "Organization Name",
      "Communication Preference",
      "Status",
      "Is Retained",
      "Total Donations",
      "Total Donated Amount",
      "Notes",
    ];

    const rows: string[] = [];
    rows.push(headers.map(escapeCsv).join(","));

    for (const d of donors) {
      const person = d.person;
      const org = d.organization;
      const addr = person?.address ?? org?.address;

      const totalDonations = d.donation.length;
      const totalAmount = d.donation.reduce(
        (sum, don) => sum + (don.amount ?? 0),
        0
      );

      const row = [
        d.id,
        d.type,
        person?.firstName ?? "",
        person?.lastName ?? "",
        person?.emailAddress ?? org?.emailAddress ?? "",
        person?.phoneNumber ?? "",
        addr?.addressLine1 ?? "",
        addr?.city ?? "",
        addr?.state ?? "",
        addr?.zipCode ?? "",
        org?.name ?? "",
        d.communicationPreference,
        d.status,
        d.isRetained ? "Yes" : "No",
        String(totalDonations),
        totalAmount.toFixed(2),
        d.notes,
      ];
      rows.push(row.map((val) => escapeCsv(String(val))).join(","));
    }

    const csv = rows.join("\n");
    const filename = `donors_export_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Donor export error:", err);
    return NextResponse.json(
      { error: "Failed to export donors" },
      { status: 500 }
    );
  }
}
