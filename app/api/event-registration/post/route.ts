import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Received event registration data:", body);

    // Check if this event requires a background check
    const event = await prisma.event.findUnique({
      where: { id: body.eventId },
      select: { bgCheckRequired: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.bgCheckRequired) {
      const bgCheck = await prisma.volunteerBackgroundCheck.findFirst({
        where: { volunteerId: body.volunteerId, status: "APPROVED" },
        select: { id: true },
      });

      if (!bgCheck) {
        return NextResponse.json(
          { error: "You need to be background checked to register for this event." },
          { status: 403 }
        );
      }
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventGroup: body.eventGroup,
        date: body.date,
        referrelSource: body.referrelSource,
        reasonForVolunteering: body.reasonForVolunteering,
        eSignature: body.eSignature,
        volunteerId: body.volunteerId,
        eventId: body.eventId,
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating event registration:", error.message);
      return NextResponse.json({ error: "Error creating event registration", details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
