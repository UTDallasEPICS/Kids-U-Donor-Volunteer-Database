import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pending = await prisma.volunteerBackgroundCheck.findMany({
      where: { status: "PENDING" },
      select: {
        id: true,
        fullName: true,
        createdAt: true,
        volunteer: { select: { emailAddress: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ pending }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching background checks:", errorMessage);
    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
