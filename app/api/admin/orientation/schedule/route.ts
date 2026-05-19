import prisma from "@/app/utils/db";
import { sendCustomEmail, sendOrientationScheduleEmail } from "@/app/utils/email";
import { NextRequest, NextResponse } from "next/server";

type UserPayload = {
  userId: string;
  email: string;
  role: "VOLUNTEER" | "ADMIN" | "SUPER_ADMIN";
};

type SlotInput = {
  startTime: string;
  endTime: string;
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

function normalizeSlots(slots: SlotInput[]) {
  const normalized = slots
    .map((slot) => ({
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime),
    }))
    .filter((slot) => !Number.isNaN(slot.startTime.getTime()) && !Number.isNaN(slot.endTime.getTime()))
    .filter((slot) => slot.endTime > slot.startTime)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const unique = new Map<string, { startTime: Date; endTime: Date }>();
  for (const slot of normalized) {
    const key = `${slot.startTime.toISOString()}|${slot.endTime.toISOString()}`;
    if (!unique.has(key)) {
      unique.set(key, slot);
    }
  }

  return Array.from(unique.values());
}

export async function GET(req: NextRequest) {
  try {
    const payload = parsePayload(req);
    if (!isAdmin(payload)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const volunteerId = new URL(req.url).searchParams.get("volunteerId");
    if (!volunteerId) {
      return NextResponse.json({ error: "volunteerId is required" }, { status: 400 });
    }

    const invitation = await prisma.volunteerOrientationInvitation.findUnique({
      where: { volunteerId },
      select: {
        id: true,
        volunteerId: true,
        meetingLink: true,
        status: true,
        firstEmailSentAt: true,
        selectionDeadline: true,
        slots: {
          where: { isBooked: false },
          orderBy: { startTime: "asc" },
          select: {
            id: true,
            startTime: true,
            endTime: true,
            adminUserId: true,
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

    return NextResponse.json({ invitation }, { status: 200 });
  } catch (error) {
    console.error("[admin/orientation/schedule][GET]", error);
    return NextResponse.json({ error: "Failed to fetch orientation schedule" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = parsePayload(req);
    if (!isAdmin(payload)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const volunteerId = typeof body?.volunteerId === "string" ? body.volunteerId.trim() : "";
    const meetingLink = typeof body?.meetingLink === "string" ? body.meetingLink.trim() : "";
    const rawSlots = Array.isArray(body?.slots) ? (body.slots as SlotInput[]) : [];
    const sendEmail = body?.sendEmail !== false;
    const emailSubject = typeof body?.emailSubject === "string" ? body.emailSubject.trim() : "";
    const emailBody = typeof body?.emailBody === "string" ? body.emailBody.trim() : "";

    if (!volunteerId || !meetingLink || rawSlots.length === 0) {
      return NextResponse.json(
        { error: "volunteerId, meetingLink, and at least one slot are required" },
        { status: 400 }
      );
    }

    const slots = normalizeSlots(rawSlots);
    if (slots.length === 0) {
      return NextResponse.json({ error: "No valid slots were provided" }, { status: 400 });
    }

    const volunteer = await prisma.volunteer.findUnique({
      where: { id: volunteerId },
      select: { id: true, firstName: true, emailAddress: true },
    });

    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 });
    }

    const now = new Date();

    const invitation = await prisma.$transaction(async (tx) => {
      const invitationRecord = await tx.volunteerOrientationInvitation.upsert({
        where: { volunteerId },
        create: {
          volunteerId,
          meetingLink,
          status: "DRAFT",
        },
        update: {
          meetingLink,
        },
        select: {
          id: true,
          firstEmailSentAt: true,
        },
      });

      await tx.volunteerOrientationSlot.createMany({
        data: slots.map((slot) => ({
          invitationId: invitationRecord.id,
          adminUserId: payload.userId,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
        skipDuplicates: true,
      });

      return invitationRecord;
    });

    let firstEmailSent = false;
    if (!invitation.firstEmailSentAt) {
      const selectionDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      if (sendEmail) {
        if (emailBody) {
          await sendCustomEmail({
            to: volunteer.emailAddress,
            subject: emailSubject || "Choose your orientation time",
            text: emailBody,
          });
        } else {
          await sendOrientationScheduleEmail({
            to: volunteer.emailAddress,
            firstName: volunteer.firstName,
            expiresAt: selectionDeadline,
          });
        }

        await prisma.volunteerOrientationInvitation.update({
          where: { volunteerId },
          data: {
            status: "SENT",
            firstEmailSentAt: now,
            selectionDeadline,
            initialEmailSentByUserId: payload.userId,
          },
        });

        firstEmailSent = true;
      }
    } else if (sendEmail) {
      if (emailBody) {
        await sendCustomEmail({
          to: volunteer.emailAddress,
          subject: emailSubject || "Orientation update",
          text: emailBody,
        });
      }
    }

    const updated = await prisma.volunteerOrientationInvitation.findUnique({
      where: { volunteerId },
      select: {
        id: true,
        status: true,
        firstEmailSentAt: true,
        selectionDeadline: true,
        meetingLink: true,
        _count: {
          select: { slots: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        firstEmailSent,
        invitation: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[admin/orientation/schedule][POST]", error);
    return NextResponse.json({ error: "Failed to save orientation schedule" }, { status: 500 });
  }
}
