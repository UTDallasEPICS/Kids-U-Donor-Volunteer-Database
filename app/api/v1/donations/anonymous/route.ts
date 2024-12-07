import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Add new donation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
        isAnonymous: true,
        acknowledgementSent: body.data.acknowledgementSent || false,
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
