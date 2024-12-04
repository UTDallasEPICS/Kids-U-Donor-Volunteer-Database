import { Donation, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Route handlers are being used (Newer), not API Routes, so we have to use NextRequest/NextResponse
// This file will handle single item operations

const prisma = new PrismaClient();

// Fetch single Donation based on id, Ex. http://localhost:3000/api/v1/donations/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const data = await prisma.donation.findUnique({
      where: {
        id: id,
      },
      // Include the donor info, but only its person property, and only the person's first and last names
      include: {
        donor: {
          select: {
            person: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json({ message: "Donation not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Successfully fetched donation with ID: ${id}`, data: data }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching donation with ID: ${id}\n`, error);
    return NextResponse.json({ message: "Donation not found" }, { status: 404 });
  }
}

// Update a single Donation based on id, and only fields that require updating
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const {
      data: { donation },
    } = (await req.json()) as { data: { donation: Donation } };

    console.log(donation);

    const updatedDonation = await prisma.donation.update({
      where: {
        id: id,
      },
      data: {
        ...donation,
        amount: typeof donation.amount === "string" ? parseFloat(donation.amount) : donation.amount,
      },
    });

    return NextResponse.json(
      {
        message: `Sucessfully updated donation with ID: ${id}`,
        data: updatedDonation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error updating donation with ID: ${id}\n`, error);
    return NextResponse.json({ message: "Donation not found" }, { status: 404 });
  }
}

// Delete single Donation based on id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const data = await prisma.donation.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Deleted data: ", data: data }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting donation with ID: ${id}`, error);
    return NextResponse.json({ message: "Donation not found" }, { status: 404 });
  }
}
