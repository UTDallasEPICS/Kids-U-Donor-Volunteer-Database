import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const volunteers = await prisma.volunteer.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
        applicationId: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });

    // Transform to include registration status
    const volunteersWithStatus = volunteers.map((volunteer) => ({
      ...volunteer,
      registration: !!volunteer.applicationId,
    }));

    return NextResponse.json({ volunteers: volunteersWithStatus }, { status: 200 });
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
