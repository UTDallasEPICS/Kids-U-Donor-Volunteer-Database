import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const data = await prisma.volunteer.findMany();

  return NextResponse.json({ volunteers: data }, { status: 200 });
}
