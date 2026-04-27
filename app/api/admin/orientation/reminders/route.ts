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

function daysSince(date: Date) {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export async function GET(req: NextRequest) {
  try {
    const payload = parsePayload(req);
    if (!isAdmin(payload)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const reminders = await prisma.volunteer.findMany({
      where: {
        dateSubmitted: { lte: oneWeekAgo },
        OR: [
          { orientationInvitation: null },
          {
            orientationInvitation: {
              is: {
                firstEmailSentAt: null,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
        dateSubmitted: true,
      },
      orderBy: { dateSubmitted: "asc" },
    });

    return NextResponse.json(
      {
        total: reminders.length,
        reminders: reminders.map((v) => ({
          ...v,
          daysSinceSignup: daysSince(v.dateSubmitted),
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[admin/orientation/reminders][GET]", error);
    return NextResponse.json({ error: "Failed to fetch orientation reminders" }, { status: 500 });
  }
}
