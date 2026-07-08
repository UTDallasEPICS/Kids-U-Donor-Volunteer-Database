import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { checkInTime, checkOutTime, hoursWorked } = body;

    const existing = await prisma.volunteerAttendance.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ message: "Attendance log not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (checkInTime !== undefined) updateData.checkInTime = new Date(checkInTime);
    if (checkOutTime !== undefined) updateData.checkOutTime = new Date(checkOutTime);
    if (hoursWorked !== undefined) updateData.hoursWorked = parseFloat(hoursWorked);

    const finalCheckIn = updateData.checkInTime || existing.checkInTime;
    const finalCheckOut = updateData.checkOutTime || existing.checkOutTime;
    if (hoursWorked === undefined && (checkInTime !== undefined || checkOutTime !== undefined)) {
      const diffMs = new Date(finalCheckOut).getTime() - new Date(finalCheckIn).getTime();
      updateData.hoursWorked = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
    }

    if (new Date(finalCheckOut) <= new Date(finalCheckIn)) {
      return NextResponse.json({ message: "Clock out time must be after clock in time" }, { status: 400 });
    }

    const updated = await prisma.volunteerAttendance.update({
      where: { id },
      data: updateData,
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
    });

    return NextResponse.json({ log: updated }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error updating volunteer log:", errorMessage);
    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const existing = await prisma.volunteerAttendance.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ message: "Attendance log not found" }, { status: 404 });
    }

    await prisma.volunteerAttendance.delete({ where: { id } });

    return NextResponse.json({ message: "Attendance log deleted successfully" }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error deleting volunteer log:", errorMessage);
    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
