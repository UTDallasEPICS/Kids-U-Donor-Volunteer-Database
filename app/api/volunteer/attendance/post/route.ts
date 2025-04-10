import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const attendance = await prisma.volunteerAttendance.create({
      data: {
        hoursWorked: body.hoursWorked,
        checkInTime: new Date(body.checkInTime),
        checkOutTime: new Date(body.checkOutTime),
        volunteerId: body.volunteerId,
        eventId: body.eventId,
      },
    });

    return NextResponse.json(attendance, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating attendance:", error.message);
      return NextResponse.json({ error: "Error creating attendance", details: error.message }, { status: 500 });
    }
  }
}
