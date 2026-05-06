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

    const schedules = await prisma.volunteerOrientationInvitation.findMany({
      where: {
        status: "CONFIRMED",
        selectedSlotId: { not: null },
      },
      orderBy: { confirmedAt: "desc" },
      select: {
        id: true,
        meetingLink: true,
        confirmedAt: true,
        status: true,
        volunteerId: true,
        volunteer: {
          select: {
            firstName: true,
            lastName: true,
            emailAddress: true,
          },
        },
        confirmedAdminUser: {
          select: {
            email: true,
            person: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        selectedSlot: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            adminUser: {
              select: {
                email: true,
                person: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        slots: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
          },
          orderBy: { startTime: "asc" },
        },
      },
    });

    return NextResponse.json({ schedules }, { status: 200 });
  } catch (error) {
    console.error("[admin/orientation/confirmed][GET]", error);
    return NextResponse.json({ error: "Failed to load orientations" }, { status: 500 });
  }
}
