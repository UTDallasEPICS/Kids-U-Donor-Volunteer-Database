import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [pending, history] = await Promise.all([
      prisma.volunteerBackgroundCheck.findMany({
        where: { status: "PENDING" },
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
          createdAt: true,
          status: true,
          volunteer: { select: { emailAddress: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.volunteerBackgroundCheck.findMany({
        where: { status: { in: ["APPROVED", "REJECTED"] } },
        select: {
          id: true,
          fullName: true,
          dateOfBirth: true,
          county: true,
          city: true,
          state: true,
          createdAt: true,
          status: true,
          volunteer: { select: { emailAddress: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ pending, history }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching background checks:", errorMessage);
    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
