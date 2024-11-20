import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Route handlers are being used (Newer), not API Routes, so we have to use NextRequest/NextResponse
// This file will handle single item operations

const prisma = new PrismaClient();

// Fetch single Donation based on id, Ex. http://localhost:3000/api/donations/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const data = await prisma.donation.findUnique({
      where: {
        id: id,
      },
    });
    //console.log(data);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching donation with ID: ", id);
    return NextResponse.json(
      { message: "Donation item not found" },
      { status: 404 }
    );
  }
}

// Update single Donation based on id
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await req.json();
    //const bodyData = JSON.parse(body) as DonationData;

    /*
    const updatedData = await prisma.donation.update({
      where: {
        DonationID: id,
      },
      data: bodyData,
    });
    */
    return NextResponse.json(
      { message: "Updated donation with id:", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching donation with ID: ", id);
    return NextResponse.json(
      { message: "Donation item not found" },
      { status: 404 }
    );
  }
}

// Delete single Donation based on id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const data = await prisma.donation.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: "Deleted data:", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting donation with ID: ", id);
    return NextResponse.json(
      { message: "Donation item not found" },
      { status: 404 }
    );
  }
}
