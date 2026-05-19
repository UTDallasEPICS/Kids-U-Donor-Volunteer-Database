import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db";

// Could be removed

export async function POST(request: NextRequest) {
  try {
    const { volunteerId, eventId, checkInTime, checkOutTime, hours } = await request.json();

    if (typeof volunteerId !== "string" || volunteerId.trim().length === 0) {
      return NextResponse.json({ error: "Volunteer ID is required" }, { status: 400 });
    }

    if (typeof eventId !== "string" || eventId.trim().length === 0) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    if (typeof checkInTime !== "string" || Number.isNaN(Date.parse(checkInTime))) {
      return NextResponse.json({ error: "Valid check-in time is required" }, { status: 400 });
    }

    if (checkOutTime !== undefined && checkOutTime !== null) {
      if (typeof checkOutTime !== "string" || Number.isNaN(Date.parse(checkOutTime))) {
        return NextResponse.json({ error: "Invalid check-out time" }, { status: 400 });
      }
      if (new Date(checkOutTime) < new Date(checkInTime)) {
        return NextResponse.json({ error: "Check-out time cannot be before check-in time" }, { status: 400 });
      }
    }

    if (hours !== undefined && (typeof hours !== "number" || Number.isNaN(hours) || hours < 0)) {
      return NextResponse.json({ error: "Hours must be a non-negative number" }, { status: 400 });
    }

    const attendance = await prisma.volunteerAttendance.create({
      data: {
        volunteerId: volunteerId.trim(),
        eventId: eventId.trim(),
        checkInTime: new Date(checkInTime),
        checkOutTime: checkOutTime ? new Date(checkOutTime) : new Date(checkInTime),
        hoursWorked: hours || 0,
      },
    });

    return NextResponse.json({ success: true, data: attendance });
  } catch (error) {
    console.error("Error in attendance POST:", error);
    return NextResponse.json({ error: "Failed to record attendance" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const volunteerId = url.searchParams.get("volunteerId");

  if (!volunteerId) {
    return NextResponse.json({ error: "Volunteer ID is required" }, { status: 400 });
  }

  try {
    const attendance = await prisma.volunteerAttendance.findMany({
      where: {
        volunteerId: volunteerId,
      },
      orderBy: {
        checkInTime: "desc",
      },
    });

    return NextResponse.json({ success: true, data: attendance });
  } catch (error) {
    console.error("Error in attendance GET:", error);
    return NextResponse.json({ error: "Failed to fetch attendance records" }, { status: 500 });
  }
}
