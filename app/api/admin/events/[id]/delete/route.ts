import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.eventRegistration.deleteMany({
      where: { eventId: params.id },
    });

    await prisma.volunteerAttendance.deleteMany({
      where: { eventId: params.id },
    });

    await prisma.eventHour.deleteMany({
      where: { eventId: params.id },
    });

    await prisma.event.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Error deleting event" }, { status: 500 });
  }
}
