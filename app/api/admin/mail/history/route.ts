import { NextResponse } from "next/server";
import prisma from "@/app/utils/db";

export async function GET() {
  try {
    const emails = await prisma.mailLog.findMany({
      orderBy: { sentAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ emails }, { status: 200 });
  } catch (error) {
    console.error("Failed to load mail history:", error);
    return NextResponse.json({ error: "Failed to load mail history" }, { status: 500 });
  }
}
