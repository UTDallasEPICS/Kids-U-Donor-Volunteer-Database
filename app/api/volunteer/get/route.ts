import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Fetch all representatives
export async function GET() {
  const data = await prisma.volunteer.findMany();

  return NextResponse.json({ message: "GET REQUEST", data: data }, { status: 200 });
}
