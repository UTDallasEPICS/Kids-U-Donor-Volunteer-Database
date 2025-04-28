// BOX 2: Total Donor Count

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const count = await prisma.donor.count();
  return NextResponse.json({ total: count });
}
