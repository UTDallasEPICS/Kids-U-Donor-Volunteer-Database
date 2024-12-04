import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { email: string } }
) {
  const { email } = params;

  try {
    // Fetch the donor record associated with the given email
    const donor = await prisma.donor.findFirst({
      where: {
        person: {
          emailAddress: email,
        },
      },
      select: {
        id: true,
      },
    });

    if (!donor) {
      // Return 404 only if donor is not found
      return NextResponse.json(
        { message: "Donor not found for this email" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Successfully created a new donor',
        id: donor.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error fetching donor for email: ${email}\n`, error);
    // Return 500 for general errors
    return NextResponse.json(
      { message: "Error fetching donor" },
      { status: 500 }
    );
  }
}
