import { Prisma } from "@prisma/client";
import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Helper function to send thank you email for donation
async function sendDonationThankYouEmail(email: string, name: string, amount: number, date: Date) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Thank You for Your Generous Donation!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank You for Your Donation, ${name}!</h2>
        <p style="color: #555; line-height: 1.6;">
          We are deeply grateful for your generous donation of <strong>${formattedAmount}</strong> 
          on ${formattedDate}.
        </p>
        <p style="color: #555; line-height: 1.6;">
          Your contribution makes a meaningful impact and helps us continue our important work. 
          Supporters like you are the foundation of our mission, and we couldn't do it without you.
        </p>
        <p style="color: #555; line-height: 1.6;">
          You will receive a formal donation receipt shortly for your tax records.
        </p>
        <p style="color: #555; line-height: 1.6;">
          With heartfelt gratitude,<br>
          <strong>The Kids-University Team</strong>
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Donation thank you email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send donation email to ${email}:`, error);
  }
}

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

    // Send thank you email for donation if email address exists
    const donationAmount =
      typeof body.data.donation.amount === "string"
        ? parseFloat(body.data.donation.amount)
        : body.data.donation.amount || 0;
    const donationDate = new Date(body.data.donation.date) || new Date();

    if (body.data.donor.type !== "Individual") {
      // Organization
      const email = body.data.organization.emailAddress;
      const name = body.data.organization.name;
      if (email && email.trim() !== "") {
        await sendDonationThankYouEmail(email, name, donationAmount, donationDate);
      }
    } else {
      // Individual
      const email = body.data.person.emailAddress;
      const name = `${body.data.person.firstName} ${body.data.person.lastName}`.trim();
      if (email && email.trim() !== "") {
        await sendDonationThankYouEmail(email, name || "Friend", donationAmount, donationDate);
      }
    }

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
  try {
    const data = await prisma.donation.findMany({
      include: {
        donor: {
          include: {
            person: { select: { firstName: true, lastName: true } },
            organization: { select: { name: true } },
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ message: "Successful fetch", data: data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json({ message: "Failed to fetch donations", error: error }, { status: 500 });
  }
}
