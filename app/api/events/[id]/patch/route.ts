import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updatedEvent = await prisma.event.update({ where: { id: params.id }, data: body });
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating event" }, { status: 500 });
  }
}
