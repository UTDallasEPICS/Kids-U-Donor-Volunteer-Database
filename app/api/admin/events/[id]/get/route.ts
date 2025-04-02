import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const event = await prisma.event.findUnique({ where: { id: params.id }, include: { location: true } });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching event" }, { status: 500 });
  }
}
