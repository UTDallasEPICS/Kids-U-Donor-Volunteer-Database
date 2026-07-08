import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.eventRegistration.deleteMany({
      where: { eventId: id },
    });

    await prisma.volunteerAttendance.deleteMany({
      where: { eventId: id },
    });

    await prisma.eventHour.deleteMany({
      where: { eventId: id },
    });

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Error deleting event" }, { status: 500 });
  }
}
