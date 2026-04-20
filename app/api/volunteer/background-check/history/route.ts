import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get all background checks with their statuses
    const backgroundChecks = await prisma.volunteerBackgroundCheck.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        fullName: true,
        dateOfBirth: true,
        email: true,
        status: true,
        declineReason: true,
        signatureDate: true,
        city: true,
        state: true,
        race: true,
        gender: true,
        approved: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "Background check history retrieved",
        data: backgroundChecks,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching background check history:", errorMessage);
    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
