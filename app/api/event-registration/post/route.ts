import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
