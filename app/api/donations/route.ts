import { Prisma } from "@prisma/client";
import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

// Add new donation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newDonation = await prisma.donation.create({
      data: {
        type: body.data.donation.type || "",
        amount:
          typeof body.data.donation.amount === "string"
            ? parseFloat(body.data.donation.amount)
            : body.data.donation.amount || 0,
        item: body.data.donation.item || "",
        paymentMethod: body.data.donation.paymentMethod || "Credit Card",
        campaign: body.data.donation.campaign || "",
        fundDesignation: body.data.donation.fundDesignation || "",
        recurringFrequency: body.data.donation.recurringFrequency || "None",
        date: new Date(body.data.donation.date) || new Date(),
        source: body.data.donation.source || "",
        isMatching: body.data.donation.isMatching,
        taxDeductibleAmount:
          typeof body.data.donation.taxDeductibleAmount === "string"
            ? parseFloat(body.data.donation.taxDeductibleAmount)
            : body.data.donation.taxDeductibleAmount || 0,
        receiptSent: body.data.donation.receiptSent || false,
        receiptNumber: body.data.donation.receiptNumber || "",
        isAnonymous: false,
        acknowledgementSent: body.data.donation.acknowledgementSent,
        donor: {
          create: {
            type: body.data.donor.type || "Individual",
            communicationPreference: body.data.donor.communicationPreference || "Email",
            status: body.data.donor.status || "Active",
            notes: body.data.donor.notes || "",
            isRetained: body.data.donor.isRetained || false,
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
        },
      },
    });

    return NextResponse.json(
      {
        message: `Successfully added donation`,
        //data: newDonation,
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
    return NextResponse.json({ message: "Error adding donation" }, { status: 500 });
  }
}

// Read
export async function GET() {
  const data = await prisma.donation.findMany();

  return NextResponse.json({ message: "Successful fetch", data: data }, { status: 200 });
}
