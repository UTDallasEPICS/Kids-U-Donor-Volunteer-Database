import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const checks = await prisma.volunteer.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
        dateSubmitted: true,
        backgroundCheckStatus: true,
      },
      orderBy: { dateSubmitted: "desc" },
    });

    return NextResponse.json({ data: checks }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching background checks:", errorMessage);
    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
