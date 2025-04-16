import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const locations = await prisma.location.findMany();
    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching locations" }, { status: 500 });
  }
}
