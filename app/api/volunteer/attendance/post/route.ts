import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hoursWorked, checkInTime, checkOutTime, eventId, volunteerId } = body;

    // Validate required fields
    if (!checkInTime || !checkOutTime || !eventId || !volunteerId) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: {
            checkInTime: !checkInTime,
            checkOutTime: !checkOutTime,
            eventId: !eventId,
            volunteerId: !volunteerId,
          },
        },
        { status: 400 }
      );
    }

    // Validate volunteer exists
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: volunteerId },
    });

    if (!volunteer) {
      return NextResponse.json(
        { error: "Volunteer not found", details: "The specified volunteer does not exist" },
        { status: 404 }
      );
    }

    // Validate event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Create attendance record
    const attendance = await prisma.volunteerAttendance.create({
      data: {
        hoursWorked: hoursWorked || 0,
        checkInTime: new Date(checkInTime),
        checkOutTime: new Date(checkOutTime),
        eventId,
        volunteerId,
      },
      include: {
        volunteer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        event: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      attendance,
      message: `Attendance recorded for ${attendance.volunteer.firstName} ${attendance.volunteer.lastName} at ${attendance.event.name}`,
    });
  } catch (error) {
    console.error("Error in attendance POST:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to save attendance record",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
