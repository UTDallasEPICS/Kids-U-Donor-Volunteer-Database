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
    return new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(new Date(d));
  } catch {
    return "";
  }
}

function boolToYesNo(val?: boolean | null): string {
  if (val === null || val === undefined) return "";
  return val ? "Yes" : "No";
}

const parseJsonArr = (v: string | string[]): string[] => { if (Array.isArray(v)) return v; try { return JSON.parse(v); } catch { return []; } };

export async function GET() {
  try {
    const volunteers = await prisma.volunteer.findMany({
      include: {
        EmergencyContact: true,
        backgroundCheck: true,
      },
      orderBy: { dateSubmitted: "desc" },
    });

    const headers = [
      "ID",
      "First Name",
      "Middle Initial",
      "Last Name",
      "Email Address",
      "Phone Number",
      "Address",
      "City",
      "State",
      "Zip Code",
      "US Citizen",
      "Drivers License",
      "Reliable Transport",
      "Speaks Spanish",
      "Business or School Name",
      "Volunteer Preference",
      "Preferred Roles",
      "Availability",
      "Locations",
      "Preferred Events",
      "Reference Name",
      "Application Completed",
      "Background Check Completed",
      "Code of Ethics Signed",
      "Abuse/Neglect Report Signed",
      "Personnel Policies Signed",
      "Orientation Completed",
      "Training Modules Completed",
      "Emergency Contact Name",
      "Emergency Contact Relationship",
      "Emergency Contact Phone",
      "Date Submitted",
    ];

    const rows: string[] = [];
    rows.push(headers.map(escapeCsv).join(","));

    for (const v of volunteers) {
      const ec = v.EmergencyContact;
      const row = [
        v.id,
        v.firstName,
        v.middleInitial ?? "",
        v.lastName,
        v.emailAddress,
        v.phoneNumber,
        v.addressLine,
        v.city,
        v.state,
        v.zipCode,
        boolToYesNo(v.usCitizen),
        boolToYesNo(v.driversLicense),
        boolToYesNo(v.reliableTransport),
        boolToYesNo(v.speakSpanish),
        v.businessOrSchoolName ?? "",
        v.volunteerPreference,
        parseJsonArr(v.preferredRoles).join("; "),
        parseJsonArr(v.availability).join("; "),
        parseJsonArr(v.location).join("; "),
        parseJsonArr(v.preferredEvents).join("; "),
        v.referenceName ?? "",
        boolToYesNo(v.volunteerApplicationCompleted),
        v.backgroundCheck?.status === "APPROVED" ? "Yes" : "No",
        boolToYesNo(v.codeOfEthicsFormSigned),
        boolToYesNo(v.abuseNeglectReportFormSigned),
        boolToYesNo(v.personnelPoliciesFormSigned),
        boolToYesNo(v.orientationCompleted),
        boolToYesNo(v.trainingModulesCompleted),
        ec?.name ?? "",
        ec?.relationship ?? "",
        ec?.phoneNumber ?? "",
        fmtDate(v.dateSubmitted),
      ];
      rows.push(row.map((val) => escapeCsv(String(val))).join(","));
    }

    const csv = rows.join("\n");
    const filename = `volunteers_export_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Volunteer export error:", err);
    return NextResponse.json({ error: "Failed to export volunteers" }, { status: 500 });
  }
}
