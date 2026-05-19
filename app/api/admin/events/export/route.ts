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

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        location: true,
        eventRegistrations: true,
        volunteerAttendances: true,
      },
      orderBy: { schedule: "desc" },
    });

    const headers = [
      "Event ID",
      "Event Name",
      "Description",
      "Schedule",
      "Location Name",
      "Location Address",
      "Location City",
      "Location State",
      "Location Zip Code",
      "Registered Volunteers",
      "Total Attendees",
    ];

    const rows: string[] = [];
    rows.push(headers.map(escapeCsv).join(","));

    for (const e of events) {
      const loc = e.location;
      const row = [
        e.id,
        e.name,
        e.description,
        fmtDate(e.schedule),
        loc?.name ?? "",
        loc?.address ?? "",
        loc?.city ?? "",
        loc?.state ?? "",
        loc?.zipCode ?? "",
        String(e.eventRegistrations.length),
        String(e.volunteerAttendances.length),
      ];
      rows.push(row.map((val) => escapeCsv(String(val))).join(","));
    }

    const csv = rows.join("\n");
    const filename = `events_export_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Event export error:", err);
    return NextResponse.json({ error: "Failed to export events" }, { status: 500 });
  }
}
