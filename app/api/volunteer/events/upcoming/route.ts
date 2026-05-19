import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db";

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function GET(request: NextRequest) {
  try {
    const userPayload = request.headers.get("x-user-payload");
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const volunteerId = url.searchParams.get("volunteerId");

    if (!volunteerId) {
      return NextResponse.json({ error: "volunteerId is required" }, { status: 400 });
    }

    const volunteer = await prisma.volunteer.findUnique({
      where: { id: volunteerId },
      select: { id: true },
    });

    if (!volunteer) {
      return NextResponse.json([], { status: 200 });
    }

    const now = new Date();

    const registrations = await prisma.eventRegistration.findMany({
      where: {
        volunteerId: volunteer.id,
        event: {
          schedule: {
            gte: now,
          },
        },
      },
      include: {
        event: {
          select: {
            name: true,
            schedule: true,
            location: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        event: {
          schedule: "asc",
        },
      },
    });

    const events = registrations
      .filter((registration) => registration.event)
      .map((registration) => ({
        name: registration.event!.name,
        date: registration.event!.schedule,
        time: formatTime(registration.event!.schedule),
        location: registration.event!.location?.name ?? "TBD",
        attended: false,
      }));

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Upcoming events error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
