import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const volunteers = await prisma.volunteer.findMany({
      where: { backgroundCheckCompleted: false },
      select: { id: true, firstName: true, lastName: true, emailAddress: true },
      orderBy: { firstName: "asc" },
    });
    return NextResponse.json({ volunteers }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching background check pending volunteers:", errorMessage);
    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
