import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const now = new Date();
  const events = await prisma.event.findMany({
    where: {
      schedule: { gte: now },
    },
    orderBy: {
      schedule: "asc", // soonest first
    },
    take: 3,
  });
  return NextResponse.json(events);
}
