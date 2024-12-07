import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const findDonorByEmail = async (email: string) => {
  try {
    // Find the person with the email
    const person = await prisma.person.findUnique({
      where: {
        emailAddress: email,
      },
      select: {
        id: true,
      },
    });

    // Find the organization with the email
    const org = await prisma.organization.findUnique({
      where: {
        emailAddress: email,
      },
      select: {
        id: true,
      },
    });

    if (person) {
      const donor = await prisma.donor.findUnique({
        where: {
          personId: person.id,
        },
        select: {
          id: true,
        },
      });

      if (donor) {
        return { id: donor.id };
      }
    }

    if (org) {
      const donor = await prisma.donor.findUnique({
        where: {
          organizationId: org.id,
        },
        select: {
          id: true,
        },
      });

      if (donor) {
        return { id: donor.id };
      }
    }

    // If neither exist
    return { donor: null };
  } catch (error) {
    console.error("Error finding donor by email:", error);
    throw new Error("Error checking email");
  }
};

// Add new donation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const donorSearch = await findDonorByEmail(body.data.donorEmail);

    if (!donorSearch.id) {
      return NextResponse.json(
        {
          message: "Donor not found",
        },
        { status: 404 }
      );
    }

    const newDonation = await prisma.donation.create({
      data: {
        type: body.data.type || "",
        amount: typeof body.data.amount === "string" ? parseFloat(body.data.amount) : body.data.amount || 0,
        item: body.data.item || "",
        paymentMethod: body.data.paymentMethod || "Credit Card",
        campaign: body.data.campaign || "",
        fundDesignation: body.data.fundDesignation || "",
        recurringFrequency: body.data.recurringFrequency || "None",
        date: new Date(body.data.date) || new Date(),
        source: body.data.source || "",
        isMatching: body.data.isMatching || false,
        taxDeductibleAmount:
          typeof body.data.taxDeductibleAmount === "string"
            ? parseFloat(body.data.taxDeductibleAmount)
            : body.data.taxDeductibleAmount || 0,
        receiptSent: body.data.receiptSent || false,
        receiptNumber: body.data.receiptNumber || "",
        isAnonymous: false,
        acknowledgementSent: body.data.acknowledgementSent || false,
        donorId: donorSearch.id,
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
    console.error(`Error adding donation`, error);
    return NextResponse.json({ message: "Error adding donation" }, { status: 500 });
  }
}
