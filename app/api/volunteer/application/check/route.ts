import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userPayloadHeader = req.headers.get("x-user-payload");
    if (!userPayloadHeader) {
      return NextResponse.json({ status: "NONE" }, { status: 200 });
    }

    const { email } = JSON.parse(userPayloadHeader);
    const existing = await prisma.volunteerApplication.findFirst({
      where: { email },
      select: { id: true, status: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { status: existing ? existing.status : "NONE" },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error checking application status:", errorMessage);
    return NextResponse.json({ status: "NONE" }, { status: 500 });
  }
}
