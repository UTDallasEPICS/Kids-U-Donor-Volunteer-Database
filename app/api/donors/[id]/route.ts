import { Address, Donor, Person, Prisma } from "@prisma/client";
import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

// Fetch single Donor based on id, Ex. http://localhost:3000/api/v1/donors/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const data = await prisma.donor.findUnique({
      where: {
        id: id,
      },
      // Include the donations info, but limit to a few fields
      include: {
        donation: {
          select: {
            id: true,
            type: true,
            amount: true,
            item: true,
            paymentMethod: true,
            date: true,
          },
        },
        // Include the person info, but only first/last names, phone, email, and address
        person: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
            emailAddress: true,
            address: true,
          },
        },
        //
        organization: {
          select: {
            name: true,
            emailAddress: true,
            address: true,
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json({ message: "Donor not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Successfully fetched donor with ID: ${id}`, data: data }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching donor with ID: ${id}\n`, error);
    return NextResponse.json({ message: "Donor not found" }, { status: 404 });
  }
}

// Update a single Donor based on id, and only fields that require updating
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const {
      data: { donor, person, address },
    } = (await req.json()) as {
      data: {
        donor: Donor;
        person: Person;
        address: Address;
      };
    };

    const updatedDonorAndPerson = await prisma.donor.update({
      where: {
        id: id,
      },
      data: {
        type: donor.type,
        communicationPreference: donor.communicationPreference,
        status: donor.status,
        notes: donor.notes,
        isRetained: donor.isRetained,

        person: {
          update: {
            ...person,
            address: {
              update: {
                ...address,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: `Sucessfully updated donor with ID: ${id}`,
        data: updatedDonorAndPerson,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const meta = error.meta as { target?: string[] };
      const fields = meta?.target || ["field"];
      const fieldList = fields.join(", ");
      return NextResponse.json(
        {
          message: `A donor with the same ${fieldList} already exists. Please use enter a different one.`,
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "Donor not found" }, { status: 404 });
  }
}

// Delete single Donor based on id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const data = await prisma.donor.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Deleted data: ", data: data }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting donor with ID: ${id}`, error);
    return NextResponse.json({ message: "Donor not found" }, { status: 404 });
  }
}
