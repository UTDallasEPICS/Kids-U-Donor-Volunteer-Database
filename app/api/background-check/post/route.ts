import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.fullName || !data.dateOfBirth || !data.race || !data.sex) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Map form data to schema field names
    const backgroundCheck = await prisma.volunteerBackgroundCheck.create({
      data: {
        fullName: data.fullName,
        dateOfBirth: new Date(data.dateOfBirth),
        county: data.county || "",
        addressLine: data.currentAddress || "",
        city: data.city || "",
        state: data.state || "",
        zipCode: data.zipCode || "",
        race: data.race,
        gender: data.sex, // Map sex to gender
        agreedToBackgroundCheck: data.agreeToBackgroundCheck || false,
        eSignature: data.electronicSignature || "",
        signatureDate: data.signatureDate || new Date().toISOString().split("T")[0],
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { message: "Background check submitted successfully", data: backgroundCheck },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error submitting background check:", errorMessage);
    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
