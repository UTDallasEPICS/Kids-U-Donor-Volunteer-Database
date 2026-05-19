import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch all volunteer attendance logs for admin view
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const volunteerId = searchParams.get("volunteerId");
    const eventId = searchParams.get("eventId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build filter conditions
    const where: any = {};
    if (volunteerId) where.volunteerId = volunteerId;
    if (eventId) where.eventId = eventId;
    if (startDate || endDate) {
      where.checkInTime = {};
      if (startDate) where.checkInTime.gte = new Date(startDate);
      if (endDate) where.checkInTime.lte = new Date(endDate);
    }

    const logs = await prisma.volunteerAttendance.findMany({
      where,
      include: {
        volunteer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            emailAddress: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { checkInTime: "desc" },
    });

    // Calculate summary stats
    const totalHours = logs.reduce((sum, log) => sum + log.hoursWorked, 0);
    const uniqueVolunteers = new Set(logs.map((l) => l.volunteerId)).size;
    const totalSessions = logs.length;

    return NextResponse.json(
      {
        logs,
        summary: {
          totalHours: Math.round(totalHours * 100) / 100,
          uniqueVolunteers,
          totalSessions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error("Error fetching volunteer logs:", errorMessage);
    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
