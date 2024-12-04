import { Donation, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Add new donation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newDonation = await prisma.donation.create({
      data: body,
    });

    return NextResponse.json(
      {
        message: `Successfully added donation`,
        data: newDonation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`Error adding donation\n`, error);
    return NextResponse.json(
      { message: "Error adding donation" },
      { status: 500 }
    );
  }
}


// Read
export async function GET() {
  const data = await prisma.donation.findMany();
  console.log(data);

  return NextResponse.json(
    { message: "GET REQUEST", data: data },
    { status: 200 }
  );
}
