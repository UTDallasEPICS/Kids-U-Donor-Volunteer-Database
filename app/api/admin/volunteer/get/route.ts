import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch all volunteers (Important fields)
export async function GET(req: NextRequest) {
  try {
    // Fetch volunteers with only important fields
    const volunteers = await prisma.volunteer.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
        registration: true,
      },
    });

    return NextResponse.json({ volunteers }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching volunteers:", errorMessage);
    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
