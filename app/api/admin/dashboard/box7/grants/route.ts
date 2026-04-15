import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const count = await prisma.grant.count({
    where: {
      status: {
        equals: "pending",
        mode: "insensitive",
      },
    },
  });
  return NextResponse.json({ total: count });
}
