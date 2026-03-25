import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userPayload = req.headers.get("x-user-payload");
  if (!userPayload) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = new URL(req.url);
  const volunteerId = url.searchParams.get("volunteerId");

  if (!volunteerId) {
    return NextResponse.json({ error: "volunteerId is required" }, { status: 400 });
  }

  try {
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: volunteerId },
      select: { id: true },
    });

    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer profile not found" }, { status: 404 });
    }

    const registrations = await prisma.eventRegistration.findMany({
      where: { volunteerId: volunteer.id },
      include: {
        event: {
          include: {
            location: true,
          },
        },
      },
    });

    const events = registrations.map((r) => r.event);
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching registered events:", error);
    return NextResponse.json({ error: "Error fetching registered events" }, { status: 500 });
  }
}
