// BOX 1: Total Volunteer Count

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const count = await prisma.volunteer.count();
  return NextResponse.json({ total: count });
}
