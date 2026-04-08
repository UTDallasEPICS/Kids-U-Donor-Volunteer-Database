import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userPayloadHeader = req.headers.get("x-user-payload");
    if (!userPayloadHeader) {
      return NextResponse.json({ submitted: false }, { status: 200 });
    }

    const userPayload = JSON.parse(userPayloadHeader);
    const volunteer = await prisma.volunteer.findFirst({
      where: { emailAddress: userPayload.email },
      select: { id: true },
    });

    if (!volunteer) {
      return NextResponse.json({ submitted: false }, { status: 200 });
    }

    const existing = await prisma.volunteerBackgroundCheck.findUnique({
      where: { volunteerId: volunteer.id },
      select: { id: true, createdAt: true, approved: true },
    });

    if (!existing) {
      return NextResponse.json({ submitted: false }, { status: 200 });
    }

    return NextResponse.json({ submitted: true, record: existing }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error checking background check status:", errorMessage);
    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
