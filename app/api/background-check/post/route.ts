import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      dateOfBirth,
      currentAddress,
      city,
      state,
      zipCode,
      county,
      race,
      sex,
      agreeToBackgroundCheck,
      electronicSignature,
      signatureDate,
    } = body;

    if (!fullName || !dateOfBirth || !race || !sex || !electronicSignature || !agreeToBackgroundCheck) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Try to link to the volunteer via JWT payload injected by middleware
    let volunteerId: string | undefined;
    const userPayloadHeader = req.headers.get("x-user-payload");
    if (userPayloadHeader) {
      const userPayload = JSON.parse(userPayloadHeader);
      const volunteer = await prisma.volunteer.findFirst({
        where: { emailAddress: userPayload.email },
        select: { id: true },
      });
      if (volunteer) volunteerId = volunteer.id;
    }

    const data = {
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      addressLine: currentAddress ?? "",
      city: city ?? "",
      state: state ?? "",
      zipCode: zipCode ?? "",
      county: county ?? "",
      race,
      gender: sex,
      agreedToBackgroundCheck: agreeToBackgroundCheck,
      eSignature: electronicSignature,
      signatureDate,
      approved: false,
    };

    let record;
    if (volunteerId) {
      record = await prisma.volunteerBackgroundCheck.upsert({
        where: { volunteerId },
        update: { ...data, createdAt: new Date() },
        create: { ...data, volunteerId },
      });
    } else {
      record = await prisma.volunteerBackgroundCheck.create({ data });
    }

    return NextResponse.json({ message: "Background check submitted", id: record.id }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error submitting background check:", errorMessage);
    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
