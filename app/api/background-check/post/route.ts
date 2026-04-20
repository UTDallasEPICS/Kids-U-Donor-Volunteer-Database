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
      fullName: fullName || "",
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
      addressLine: currentAddress ?? "",
      city: city ?? "",
      state: state ?? "",
      zipCode: zipCode ?? "",
      county: county ?? "",
      race: race || "",
      gender: sex || "",
      agreedToBackgroundCheck: Boolean(agreeToBackgroundCheck),
      eSignature: electronicSignature || "",
      signatureDate: signatureDate || new Date().toISOString().split("T")[0],
      status: "PENDING" as const,
    };

    console.log("Background check data:", JSON.stringify(data, null, 2));

    let record;
    try {
      if (volunteerId) {
        console.log("Upserting background check for volunteerId:", volunteerId);
        record = await prisma.volunteerBackgroundCheck.upsert({
          where: { volunteerId },
          update: { ...data },
          create: { ...data, volunteerId },
        });
      } else {
        console.log("Creating new background check record");
        record = await prisma.volunteerBackgroundCheck.create({ data });
      }
      console.log("Background check record created/updated:", record.id);
    } catch (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    return NextResponse.json({ message: "Background check submitted", id: record.id }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error submitting background check:", errorMessage);
    console.error("Full error:", error);
    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
    }
    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
