import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const avg = await prisma.donation.aggregate({
    _avg: { amount: true },
  });
  return NextResponse.json({ average: avg._avg.amount || 0 });
}
