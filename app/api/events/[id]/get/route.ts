import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: { location: true },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Error fetching event:", e.message);
      return NextResponse.json({ error: "Error fetching event", details: e.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
