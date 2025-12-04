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

// Helper function to send thank you email
async function sendThankYouEmail(email: string, name: string) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Thank You for Your Support!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank You, ${name}!</h2>
        <p style="color: #555; line-height: 1.6;">
          We are incredibly grateful for your generous support. Your contribution makes a real difference 
          and helps us continue our mission.
        </p>
        <p style="color: #555; line-height: 1.6;">
          We truly appreciate your trust in our organization and your commitment to our cause.
        </p>
        <p style="color: #555; line-height: 1.6;">
          With heartfelt thanks,<br>
          <strong>The Kids-University Team</strong>
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Thank you email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
  }
}

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
        ...(body.data.donor.type !== "Individual"
          ? {
              organization: {
                create: {
                  name: body.data.organization.name || "",
                  emailAddress: body.data.organization.emailAddress || "",
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

    // Send thank you email if email address exists
    if (body.data.donor.type !== "Individual") {
      // Organization
      const email = body.data.organization.emailAddress;
      const name = body.data.organization.name;
      if (email && email.trim() !== "") {
        await sendThankYouEmail(email, name);
      }
    } else {
      // Individual
      const email = body.data.person.emailAddress;
      const name = `${body.data.person.firstName} ${body.data.person.lastName}`.trim();
      if (email && email.trim() !== "") {
        await sendThankYouEmail(email, name || "Friend");
      }
    }

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
  try {
    const data = await prisma.donor.findMany({
      include: {
        person: {
          select: {
            firstName: true,
            lastName: true,
            emailAddress: true,
            phoneNumber: true,
          },
        },
        organization: {
          select: {
            name: true,
            emailAddress: true,
          },
        },
        donation: {
          select: {
            amount: true,
            date: true,
          },
          orderBy: { date: "desc" },
        },
      },
    });

    return NextResponse.json({ message: "Successful fetch", data: data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json({ message: "Failed to fetch donors", error: error }, { status: 500 });
  }
}
