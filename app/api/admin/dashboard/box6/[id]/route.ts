import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { title, completed } = body;
  const task = await prisma.task.update({
    where: { id: Number(params.id) },
    data: { title, completed },
  });
  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.task.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ message: "Task deleted" });
}
