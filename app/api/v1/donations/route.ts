import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Route handlers are being used (Newer), not API Routes, so we have to use NextRequest/NextResponse

const prisma = new PrismaClient();

// Create
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    //console.log(body);

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
  ``;
}

// Read
export async function GET() {
  const data = await prisma.donation.findMany();

  return NextResponse.json(
    { message: "GET REQUEST", data: data },
    { status: 200 }
  );
}
