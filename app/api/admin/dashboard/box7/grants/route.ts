export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const count = await prisma.grant.count({
    where: {
      status: {
        equals: "pending",
      },
    },
  });
  return NextResponse.json({ total: count });
}
