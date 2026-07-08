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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = parsePayload(req);
    if (!isAdmin(payload)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const meetingLink = typeof body.meetingLink === "string" ? body.meetingLink.trim() : "";
    const selectedSlotId = typeof body.selectedSlotId === "string" ? body.selectedSlotId : "";

    const invitation = await prisma.volunteerOrientationInvitation.findUnique({
      where: { id },
      select: {
        id: true,
        volunteerId: true,
        selectedSlotId: true,
        meetingLink: true,
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Orientation not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      if (selectedSlotId && selectedSlotId !== invitation.selectedSlotId) {
        if (invitation.selectedSlotId) {
          await tx.volunteerOrientationSlot.update({
            where: { id: invitation.selectedSlotId },
            data: {
              isBooked: false,
              bookedByVolunteerId: null,
              bookedAt: null,
            },
          });
        }

        await tx.volunteerOrientationSlot.update({
          where: { id: selectedSlotId },
          data: {
            isBooked: true,
            bookedByVolunteerId: invitation.volunteerId,
            bookedAt: new Date(),
          },
        });
      }

      await tx.volunteerOrientationInvitation.update({
        where: { id },
        data: {
          meetingLink: meetingLink || invitation.meetingLink,
          selectedSlotId: selectedSlotId || invitation.selectedSlotId,
        },
      });
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/orientation/confirmed][PATCH]", error);
    return NextResponse.json({ error: "Failed to update orientation" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = parsePayload(req);
    if (!isAdmin(payload)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.$transaction(async (tx) => {
      await tx.volunteerOrientationSlot.deleteMany({ where: { invitationId: id } });
      await tx.volunteerOrientationInvitation.delete({ where: { id } });
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[admin/orientation/confirmed][DELETE]", error);
    return NextResponse.json({ error: "Failed to delete orientation" }, { status: 500 });
  }
}
