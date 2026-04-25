import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

type UserPayload = {
  userId: string;
  email: string;
  role: "VOLUNTEER" | "ADMIN" | "SUPER_ADMIN";
};

function parsePayload(req: NextRequest): UserPayload | null {
  const raw = req.headers.get("x-user-payload");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserPayload;
  } catch {
    return null;
  }
}

function isAdmin(user: UserPayload | null): user is UserPayload {
  return !!user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN");
}

export async function GET(req: NextRequest) {
  try {
    const payload = parsePayload(req);
    if (!isAdmin(payload)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const tasks = await prisma.volunteerOrientationInvitation.findMany({
      where: {
        confirmedAdminUserId: payload.userId,
        status: "CONFIRMED",
      },
      orderBy: { confirmedAt: "desc" },
      take: 10,
      select: {
        id: true,
        meetingLink: true,
        confirmedAt: true,
        volunteer: {
          select: {
            firstName: true,
            lastName: true,
            emailAddress: true,
          },
        },
        selectedSlot: {
          select: {
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("[admin/orientation/tasks][GET]", error);
    return NextResponse.json({ error: "Failed to load orientation tasks" }, { status: 500 });
  }
}
