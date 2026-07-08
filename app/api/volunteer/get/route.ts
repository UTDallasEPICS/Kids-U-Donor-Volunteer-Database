export const dynamic = 'force-dynamic';
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const data = await prisma.volunteer.findMany({
    orderBy: { dateSubmitted: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      emailAddress: true,
      registration: true,
      dateSubmitted: true,
      orientationInvitation: {
        select: {
          id: true,
          status: true,
          firstEmailSentAt: true,
        },
      },
    },
  });

  return NextResponse.json({ volunteers: data }, { status: 200 });
}
