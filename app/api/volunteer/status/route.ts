import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userPayloadHeader = req.headers.get("x-user-payload");
    if (!userPayloadHeader) {
      return NextResponse.json({ appStatus: "NONE", bgCheckStatus: "NONE" });
    }

    const { email } = JSON.parse(userPayloadHeader);

    const [app, volunteer] = await Promise.all([
      prisma.volunteerApplication.findFirst({
        where: { email },
        select: { status: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.volunteer.findFirst({
        where: { emailAddress: email },
        select: { backgroundCheckStatus: true },
      }),
    ]);

    const result = {
      appStatus: app?.status ?? "NONE",
      bgCheckStatus: volunteer?.backgroundCheckStatus ?? "NONE",
    };
    console.log("[volunteer/status]", email, result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching volunteer status:", error);
    return NextResponse.json({ appStatus: "NONE", bgCheckStatus: "NONE" });
  }
}
