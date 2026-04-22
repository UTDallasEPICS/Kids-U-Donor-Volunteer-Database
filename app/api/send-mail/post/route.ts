import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  try {
    // Parse request body
    const { recipientType, to, subject, body, from } = await request.json();
    const normalizedRecipientType = typeof recipientType === "string" ? recipientType.trim().toLowerCase() : "";
    const normalizedTo = typeof to === "string" ? to.trim().toLowerCase() : "";
    const normalizedFrom = typeof from === "string" ? from.trim().toLowerCase() : "";
    const normalizedSubject = typeof subject === "string" ? subject.trim() : "";
    const normalizedBody = typeof body === "string" ? body.trim() : "";

    // Validate required fields
    if (!normalizedSubject || !normalizedBody) {
      return NextResponse.json({ error: "Missing required fields: subject and body are required" }, { status: 400 });
    }

    if (!["individual", "volunteers", "admins"].includes(normalizedRecipientType)) {
      return NextResponse.json({ error: "Invalid recipient type" }, { status: 400 });
    }

    if (normalizedFrom && !EMAIL_REGEX.test(normalizedFrom)) {
      return NextResponse.json({ error: "Invalid sender email address" }, { status: 400 });
    }

    // Create transporter with SMTP configuration
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    

    let recipients: string[] = [];
    let emailCount = 0;

    // Determine recipients based on type
    if (normalizedRecipientType === "individual") {
      if (!normalizedTo) {
        return NextResponse.json({ error: "Recipient email is required for individual emails" }, { status: 400 });
      }

      // Validate email format
      if (!EMAIL_REGEX.test(normalizedTo)) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
      }

      recipients = [normalizedTo];
    } else if (normalizedRecipientType === "volunteers" || normalizedRecipientType === "admins") {
      const users = await prisma.user.findMany({
        where: {
          role: normalizedRecipientType === "volunteers" ? "VOLUNTEER" : "ADMIN",
        },
        select: {
          email: true,
        },
      });
      recipients = users.map((user) => user.email);
    }

    

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No recipients found" }, { status: 404 });
    }

    

    // Send emails
    const mailOptions = {
      from: normalizedFrom || process.env.SMTP_USER, //replace with the email variable  for admin //
      subject: normalizedSubject,
      text: normalizedBody,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; white-space: pre-wrap;">${normalizedBody.replace(/\n/g, "<br>")}</div>`,
    };

    

    // Send to all recipients
    for (const recipientEmail of recipients) {
      try {
        await transporter.sendMail({
          ...mailOptions,
          to: recipientEmail,
        });
        emailCount++;

        // Persist to volunteer inbox if recipient is a volunteer
        if (recipientType !== 'admins') {
          const volunteer = await prisma.volunteer.findFirst({
            where: { emailAddress: recipientEmail },
            select: { id: true },
          });
          if (volunteer) {
            await prisma.sentEmail.create({
              data: { subject, body, volunteerId: volunteer.id },
            });
          }
        }
      } catch (error) {
        console.error(`Failed to send email to ${recipientEmail}:`, error);
      }
    }

    

    return NextResponse.json(
      {
        message: "Email(s) sent successfully",
        count: emailCount,
        total: recipients.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
  }
}
