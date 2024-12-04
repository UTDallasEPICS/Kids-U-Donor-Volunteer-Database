import { Address, Donor, Person, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();


// Add new donor
export async function POST(req: NextRequest) {
  try {
    const { donor, person, address } = (await req.json()) as {
      donor: Donor;
      person: Person;
      address: Address;
    };

    // Create the donor with nested person and address records
    const newDonor = await prisma.donor.create({
      data: {
        type: donor.type,
        communicationPreference: donor.communicationPreference,
        status: donor.status,
        notes: donor.notes,
        isRetained: donor.isRetained,
        
        person: {
          create: {
            ...person,
            address: {
              create: {
                ...address,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Successfully created a new donor',
        id: newDonor.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating donor:', error);
    return NextResponse.json({ message: 'Failed to create donor' }, { status: 500 });
  }
}

// Read
export async function GET() {
  const data = await prisma.donor.findMany();

  return NextResponse.json(
    { message: "GET REQUEST", data: data },
    { status: 200 }
  );
}
