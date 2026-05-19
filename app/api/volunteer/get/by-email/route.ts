import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const volunteer = await prisma.volunteer.findFirst({
      where: { emailAddress: email },
      select: { id: true },
    });

    if (!volunteer) {
      return NextResponse.json({ volunteerId: null }, { status: 200 });
    }

    return NextResponse.json({ volunteerId: volunteer.id }, { status: 200 });
  } catch (error) {
    console.error("Error fetching volunteer by email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
