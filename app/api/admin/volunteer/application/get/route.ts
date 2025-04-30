// app/api/applications/route.ts (for App Router)
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const applications = await prisma.volunteerApplication.findMany({
      select: {
        id: true,
        createdAt: true,
        legalName: true,
        preferredName: true,
        email: true,
        phoneNumber: true,
        educationLevel: true,
        accepted: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
