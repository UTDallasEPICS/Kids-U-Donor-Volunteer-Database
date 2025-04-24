import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

// Create
export async function POST(req: NextRequest) {
  try {
    const body = req.json();

    return NextResponse.json(
      {
        message: "POST REQUEST",
        receivedData: body,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST ERROR:", error);
  }
}
