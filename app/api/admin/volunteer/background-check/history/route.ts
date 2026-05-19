import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const checks = await prisma.volunteerBackgroundCheck.findMany({
      where: { status: { in: ["APPROVED", "DECLINED"] } },
      select: {
        id: true,
        fullName: true,
        createdAt: true,
        status: true,
        volunteer: { select: { emailAddress: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: checks }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching background checks:", errorMessage);
    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
