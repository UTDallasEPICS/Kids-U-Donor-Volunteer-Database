import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updatedEvent = await prisma.event.update({ where: { id }, data: body });
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating event" }, { status: 500 });
  }
}
