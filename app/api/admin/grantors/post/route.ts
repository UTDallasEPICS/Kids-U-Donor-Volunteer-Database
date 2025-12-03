import prisma, { prismaSoftDelete } from "@/app/utils/db";
import { PrismaClient } from "@prisma/client";
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

// Create
export async function POST(request: Request) {
  try {
    const grantor = await request.json();

    const newGrantor = await prisma.grantor.create({
      data: {
        type: grantor.type,
        websiteLink: grantor.websiteLink,
        communicationPreference: grantor.communicationPreference,
        recognitionPreference: grantor.recognitionPreference,
        internalRelationshipManager: grantor.internalRelationshipManager,
        organization: {
          create: {
            name: grantor.organization.name,
            emailAddress: grantor.organization.emailAddress,
          },
        },
        representative: {
          create: {
            positionTitle: grantor.representative.positionTitle,
            person: {
              create: {
                firstName: grantor.representative.person.firstName,
                lastName: grantor.representative.person.lastName,
                emailAddress: grantor.representative.person.emailAddress,
              },
            },
          },
        },
        deletedAt: grantor.DateTime,
        status: grantor.status,
      },
    });

    return new Response(JSON.stringify(newGrantor), { status: 201 });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error creating grantor:", errorMessage);

    return NextResponse.json({ message: "Error creating grantor", error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
