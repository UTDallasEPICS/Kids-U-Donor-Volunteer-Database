import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db";
import mailjet from "node-mailjet";

const mj = mailjet.apiConnect(process.env.MAILJET_API_KEY!, process.env.MAILJET_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    // 1. Get the latest event
    const latestEvent = await prisma.event.findFirst({
      orderBy: { schedule: "desc" },
      include: {
        location: true,
        eventRegistrations: {
          include: {
            volunteer: true,
          },
        },
      },
    });

    if (!latestEvent) {
      return NextResponse.json({ error: "No events found." }, { status: 404 });
    }

    // 2. Prepare recipients from event registrations
    const recipients = latestEvent.eventRegistrations.map((registration) => ({
      Email: registration.volunteer.emailAddress,
      Name: `${registration.volunteer.firstName || ""} ${registration.volunteer.lastName || ""}`.trim(),
    }));

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No volunteers signed up for the latest event." }, { status: 400 });
    }

    // Format date and time from the schedule field
    const eventDate = latestEvent.schedule.toLocaleDateString();
    const startTime = latestEvent.schedule.toLocaleTimeString();
    const endTime = new Date(latestEvent.schedule.getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString();

    // 3. Prepare email content
    const subject = `You're confirmed for ${latestEvent.name}!`;
    const htmlBody = `
      <p>Hi {{firstName}},</p>
      <p>Thanks for signing up for <strong>${latestEvent.name}</strong>!</p>
      <ul>
        <li><strong>Location:</strong> ${latestEvent.location?.name || "TBD"}</li>
        <li><strong>Date:</strong> ${eventDate}</li>
        <li><strong>Time:</strong> ${startTime} - ${endTime}</li>
      </ul>
      <p>We're excited to see you there! If you have any questions, just reply to this email.</p>
    `;

    // 4. Send using Mailjet
    const request = await mj.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "info@kidsu.com",
            Name: "KidsU Admin",
          },
          To: recipients,
          Subject: subject,
          HTMLPart: htmlBody,
        },
      ],
    });

    return NextResponse.json(
      {
        message: "Emails sent successfully",
        data: request.body,
        recipientsCount: recipients.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: "Failed to send emails.", details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
