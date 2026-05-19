import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const checks = await prisma.volunteerBackgroundCheck.findMany({
      select: {
        id: true,
        fullName: true,
        dateOfBirth: true,
        county: true,
        addressLine: true,
        city: true,
        state: true,
        zipCode: true,
        race: true,
        gender: true,
        agreedToBackgroundCheck: true,
        eSignature: true,
        signatureDate: true,
        status: true,
        declineReason: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: checks }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching background checks:", errorMessage);
    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
