import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Add new donor
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newDonor = await prisma.donor.create({
      data: {
        type: body.data.donor.type || "Individual",
        communicationPreference: body.data.donor.communicationPreference || "Email",
        status: body.data.donor.status || "Active",
        notes: body.data.donor.notes || "",
        isRetained: body.data.donor.isRetained || false,
        segment: body.data.donor.segment || "",
        ...(body.data.donor.type !== "Individual"
          ? {
              organization: {
                create: {
                  name: body.data.organization.name || "",
                  emailAddress: body.data.organization.emailAddress || "",
                  phoneNumber: body.data.organization.phoneNumber || "",
                  address: {
                    create: {
                      addressLine1: body.data.address.addressLine1 || "",
                      addressLine2: body.data.address.addressLine2 || "",
                      city: body.data.address.city || "",
                      state: body.data.address.state || "",
                      zipCode: body.data.address.zipCode || "",
                      type: body.data.address.type || "Residential",
                    },
                  },
                },
              },
            }
          : {
              person: {
                create: {
                  firstName: body.data.person.firstName || "",
                  lastName: body.data.person.lastName || "",
                  emailAddress: body.data.person.emailAddress || "",
                  phoneNumber: body.data.person.phoneNumber || "",
                  address: {
                    create: {
                      addressLine1: body.data.address.addressLine1 || "",
                      addressLine2: body.data.address.addressLine2 || "",
                      city: body.data.address.city || "",
                      state: body.data.address.state || "",
                      zipCode: body.data.address.zipCode || "",
                      type: body.data.address.type || "Residential",
                    },
                  },
                },
              },
            }),
      },
    });

    return NextResponse.json(
      {
        message: "Successfully created a new donor",
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

    return NextResponse.json({ message: "Failed to create donor" }, { status: 500 });
  }
}

// Read
export async function GET() {
  const data = await prisma.donor.findMany();

  return NextResponse.json({ message: "GET REQUEST", data: data }, { status: 200 });
}
