import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { recipientType, to, subject, body } = await request.json();

    // Validate required fields
    if (!subject || !body) {
      return NextResponse.json({ error: "Missing required fields: subject and body are required" }, { status: 400 });
    }

    // Create transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Test email
        pass: process.env.GMAIL_PASS, // App password
      },
    });

    let recipients: string[] = [];
    let emailCount = 0;

    // Determine recipients based on type
    if (recipientType === "individual") {
      if (!to) {
        return NextResponse.json({ error: "Recipient email is required for individual emails" }, { status: 400 });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
      }

      recipients = [to];
    } else if (recipientType === "volunteers" || recipientType === "admins") {
      const users = await prisma.user.findMany({
        where: {
          role: recipientType === "volunteers" ? "VOLUNTEER" : "ADMIN",
        },
        select: {
          email: true,
        },
      });
      recipients = users.map((user) => user.email);

      return NextResponse.json({ error: "Database query not implemented." }, { status: 501 });
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No recipients found" }, { status: 404 });
    }

    // Send emails
    const mailOptions = {
      from: process.env.GMAIL_USER,
      subject: subject,
      text: body,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; white-space: pre-wrap;">${body.replace(/\n/g, "<br>")}</div>`,
    };

    // Send to all recipients
    for (const recipientEmail of recipients) {
      try {
        await transporter.sendMail({
          ...mailOptions,
          to: recipientEmail,
        });
        emailCount++;
      } catch (error) {
        console.error(`Failed to send email to ${recipientEmail}:`, error);
        // Continue sending to other recipients even if one fails
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
