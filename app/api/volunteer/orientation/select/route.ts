import prisma from "@/app/utils/db";
import { sendOrientationAdminNotification, sendOrientationConfirmationEmails } from "@/app/utils/email";
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

export async function POST(req: NextRequest) {
  try {
    const payload = parsePayload(req);
    if (!payload || payload.role !== "VOLUNTEER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slotId } = await req.json();
    const normalizedSlotId = typeof slotId === "string" ? slotId.trim() : "";

    if (!normalizedSlotId) {
      return NextResponse.json({ error: "slotId is required" }, { status: 400 });
    }

    const volunteer = await prisma.volunteer.findFirst({
      where: { emailAddress: payload.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
      },
    });

    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 });
    }

    const invitation = await prisma.volunteerOrientationInvitation.findUnique({
      where: { volunteerId: volunteer.id },
      select: {
        id: true,
        status: true,
        meetingLink: true,
        selectionDeadline: true,
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "No orientation invitation found" }, { status: 404 });
    }

    if (!invitation.selectionDeadline || invitation.selectionDeadline.getTime() < Date.now()) {
      await prisma.volunteerOrientationInvitation.update({
        where: { id: invitation.id },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json({ error: "Selection window expired" }, { status: 400 });
    }

    if (invitation.status === "CONFIRMED") {
      return NextResponse.json({ error: "Orientation is already confirmed" }, { status: 400 });
    }

    const slot = await prisma.volunteerOrientationSlot.findFirst({
      where: {
        id: normalizedSlotId,
        invitationId: invitation.id,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        isBooked: true,
        adminUserId: true,
      },
    });

    if (!slot) {
      return NextResponse.json({ error: "Selected slot not found" }, { status: 404 });
    }

    if (slot.isBooked) {
      return NextResponse.json({ error: "Selected slot is no longer available" }, { status: 409 });
    }

    const now = new Date();

    const booked = await prisma.$transaction(async (tx) => {
      const updateResult = await tx.volunteerOrientationSlot.updateMany({
        where: {
          id: slot.id,
          isBooked: false,
        },
        data: {
          isBooked: true,
          bookedAt: now,
          bookedByVolunteerId: volunteer.id,
        },
      });

      if (updateResult.count === 0) {
        throw new Error("Slot already booked");
      }

      const updatedInvitation = await tx.volunteerOrientationInvitation.update({
        where: { id: invitation.id },
        data: {
          status: "CONFIRMED",
          confirmedAt: now,
          confirmedAdminUserId: slot.adminUserId,
          selectedSlotId: slot.id,
        },
      });

      return updatedInvitation;
    });

    const admin = await prisma.user.findUnique({
      where: { id: slot.adminUserId },
      select: {
        email: true,
        person: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin host not found" }, { status: 500 });
    }

    const adminName = [admin.person?.firstName, admin.person?.lastName].filter(Boolean).join(" ") || admin.email;
    const volunteerName = `${volunteer.firstName} ${volunteer.lastName}`.trim();

    await sendOrientationAdminNotification({
      adminEmail: admin.email,
      adminName,
      volunteerName,
      meetingLink: booked.meetingLink,
      startTime: slot.startTime,
    });

    await sendOrientationConfirmationEmails({
      volunteerName,
      volunteerEmail: volunteer.emailAddress,
      adminName,
      adminEmail: admin.email,
      meetingLink: booked.meetingLink,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[volunteer/orientation/select][POST]", error);
    const message = error instanceof Error ? error.message : "Failed to confirm orientation";
    if (message === "Slot already booked") {
      return NextResponse.json({ error: "Selected slot is no longer available" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to confirm orientation" }, { status: 500 });
  }
}
