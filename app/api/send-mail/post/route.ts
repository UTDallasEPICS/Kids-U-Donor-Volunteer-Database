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
      html: `<html>
              <head>
                <meta charset="UTF-8">
                <style> 
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container {max-width: 600px; margin: 0 auto; padding: 20px}
                .header{background-color: #4F46E5; color: white; padding: 20px; text-align: center;}
                .content {background-color: #f9fafb; padding: 20px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1> Email From Kids U </h1>              
                  </div>
                  <div class="content">
                     <h2>${normalizedSubject}</h2>
                     <p>${normalizedBody.replace(/\n/g, "<br>")}</p>
                     <div style= "text-allign: center;">
                     </div>
                   </div>
                  </div>
                </div>
              </body>
            </html>`

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

    await prisma.mailLog.create({
      data: {
        recipientType: normalizedRecipientType,
        to: normalizedRecipientType === "individual" ? normalizedTo : null,
        subject: normalizedSubject,
        body: normalizedBody,
        senderEmail: normalizedFrom || null,
        totalRecipients: recipients.length,
        successCount: emailCount,
        failureCount: Math.max(0, recipients.length - emailCount),
      },
    });

    

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
