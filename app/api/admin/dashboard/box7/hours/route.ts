import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const totals = await prisma.volunteerAttendance.aggregate({
    _sum: {
      hoursWorked: true,
    },
  });

  return NextResponse.json({ total: totals._sum.hoursWorked ?? 0 });
}
