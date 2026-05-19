import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db";

export async function GET(request: NextRequest) {
  try {
    const userPayload = request.headers.get("x-user-payload");
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const volunteerId = url.searchParams.get("volunteerId");

    if (!volunteerId) {
      return NextResponse.json({ error: "volunteerId is required" }, { status: 400 });
    }

    const volunteer = await prisma.volunteer.findUnique({
      where: { id: volunteerId },
      select: { id: true },
    });

    if (!volunteer) {
      return NextResponse.json({ total: 0, attendedCount: 0 }, { status: 200 });
    }

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfNextYear = new Date(now.getFullYear() + 1, 0, 1);

    const totals = await prisma.volunteerAttendance.aggregate({
      where: { volunteerId: volunteer.id },
      _sum: { hoursWorked: true },
    });

    const attendedEvents = await prisma.volunteerAttendance.findMany({
      where: {
        volunteerId: volunteer.id,
        checkInTime: { gte: startOfYear, lt: startOfNextYear },
      },
      distinct: ["eventId"],
      select: { eventId: true },
    });

    return NextResponse.json(
      { total: totals._sum.hoursWorked ?? 0, attendedCount: attendedEvents.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Volunteer hours error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
