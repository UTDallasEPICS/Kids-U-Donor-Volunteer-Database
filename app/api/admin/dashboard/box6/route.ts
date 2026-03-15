import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // const tasks = await prisma.task.findMany();
  // return NextResponse.json(tasks);
  return NextResponse.json([]);
}

export async function POST(req: NextRequest) {
  // const body = await req.json();
  // const { title, completed } = body;
  // const task = await prisma.task.create({
  //   data: { title, completed },
  // });
  // return NextResponse.json(task);
  return NextResponse.json({ message: "Task model disabled" });
}
