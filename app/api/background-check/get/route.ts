import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function GET() {
  try {
    if (!JWT_SECRET) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as unknown as JWTPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { person: { select: { volunteer: { select: { id: true } } } } },
    });

    const volunteerId = user?.person?.volunteer?.id;
    if (!volunteerId) {
      return NextResponse.json({ submitted: false, record: null }, { status: 200 });
    }

    const record = await prisma.volunteerBackgroundCheck.findFirst({
      where: { volunteerId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ submitted: Boolean(record), record }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching background check status:", errorMessage);
    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
