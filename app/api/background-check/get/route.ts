import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const records = await prisma.volunteerBackgroundCheck.findMany({
      where: {
        status: "PENDING", // Changed from approved: false to status: PENDING
      },
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
        gender: true, // This matches your schema (not sex)
        agreedToBackgroundCheck: true, // This matches your schema (not agreeToBackgroundCheck)
        eSignature: true,
        signatureDate: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ records }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching pending background checks:", errorMessage);
    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
