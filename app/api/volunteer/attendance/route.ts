import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";

export async function POST(request: NextRequest) {
  try {
    const { volunteerId, checkInTime, checkOutTime, hours } = await request.json();

    const attendance = await prisma.attendance.create({
      data: {
        volunteerId,
        checkInTime: new Date(checkInTime),
        checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
        hours: hours || 0,
      },
    });

    return NextResponse.json({ success: true, data: attendance });
  } catch (error) {
    console.error("Error in attendance POST:", error);
    return NextResponse.json(
      { error: "Failed to record attendance" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const volunteerId = url.searchParams.get("volunteerId");

  if (!volunteerId) {
    return NextResponse.json(
      { error: "Volunteer ID is required" },
      { status: 400 }
    );
  }

  try {
    const attendance = await prisma.attendance.findMany({
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
    return NextResponse.json(
      { error: "Failed to fetch attendance records" },
      { status: 500 }
    );
  }
}