import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const eventHours = await prisma.eventHour.findMany({
    select: {
      loginTime: true,
      logoutTime: true,
    },
  });

  const totalHours = eventHours.reduce((sum, record) => {
    if (record.logoutTime && record.loginTime) {
      const diffMs = new Date(record.logoutTime).getTime() - new Date(record.loginTime).getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return sum + diffHours;
    }
    return sum;
  }, 0);

  return NextResponse.json({ total: totalHours });
}
