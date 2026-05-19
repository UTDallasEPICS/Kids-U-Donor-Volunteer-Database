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

export async function GET(req: NextRequest) {
  try {
    const payload = parsePayload(req);
    const volunteerIdFromQuery = new URL(req.url).searchParams.get("volunteerId")?.trim() || "";

    if ((!payload || payload.role !== "VOLUNTEER") && !volunteerIdFromQuery) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const volunteer = volunteerIdFromQuery
      ? await prisma.volunteer.findUnique({
          where: { id: volunteerIdFromQuery },
          select: { id: true },
        })
      : await prisma.volunteer.findFirst({
          where: { emailAddress: payload?.email || "" },
          select: { id: true },
        });

    if (!volunteer) {
      return NextResponse.json({ invitation: null }, { status: 200 });
    }

    const invitation = await prisma.volunteerOrientationInvitation.findUnique({
      where: { volunteerId: volunteer.id },
      select: {
        id: true,
        status: true,
        meetingLink: true,
        firstEmailSentAt: true,
        selectionDeadline: true,
        selectedSlotId: true,
        selectedSlot: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
          },
        },
        slots: {
          where: { isBooked: false },
          orderBy: { startTime: "asc" },
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
      },
    });

    if (!invitation) {
      return NextResponse.json({ invitation: null }, { status: 200 });
    }

    const now = new Date();
    const isExpired =
      !!invitation.selectionDeadline &&
      invitation.selectionDeadline.getTime() < now.getTime() &&
      invitation.status !== "CONFIRMED";

    if (isExpired && invitation.status !== "EXPIRED") {
      await prisma.volunteerOrientationInvitation.update({
        where: { id: invitation.id },
        data: { status: "EXPIRED" },
      });
    }

    return NextResponse.json(
      {
        invitation: {
          ...invitation,
          status: isExpired ? "EXPIRED" : invitation.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[volunteer/orientation/options][GET]", error);
    return NextResponse.json({ error: "Failed to fetch orientation options" }, { status: 500 });
  }
}
