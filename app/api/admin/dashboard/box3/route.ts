// BOX 2: Total Grant Count

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const count = await prisma.grant.count();
  return NextResponse.json({ total: count });
}
