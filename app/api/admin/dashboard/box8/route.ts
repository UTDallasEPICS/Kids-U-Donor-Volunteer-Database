// app/api/admin/dashboard/box8/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const FUNDRAISING_GOAL = 5000;

export async function GET() {
  const result = await prisma.donation.aggregate({
    _sum: { amount: true },
  });
  const raised = result._sum.amount ?? 0;
  return NextResponse.json({ raised, goal: FUNDRAISING_GOAL });
}
