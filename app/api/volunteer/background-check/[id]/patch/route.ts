import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { sendApplicationRejectionEmail, sendApplicationApprovalEmail } from "@/app/utils/email";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, declineReason } = body;

    if (!status || !["APPROVED", "DECLINED", "PENDING"].includes(status)) {
      return NextResponse.json({ message: "Invalid status. Must be APPROVED, DECLINED, or PENDING" }, { status: 400 });
    }

    // Validate decline reason for DECLINED status
    if (status === "DECLINED" && !declineReason?.trim()) {
      return NextResponse.json({ message: "Decline reason is required when declining" }, { status: 400 });
    }

    // Fetch the background check to get volunteerId
    const existingCheck = await prisma.volunteerBackgroundCheck.findUnique({
      where: { id },
      select: {
        fullName: true,
        volunteerId: true,
      },
    });

    if (!existingCheck) {
      return NextResponse.json({ message: "Background check not found" }, { status: 404 });
    }

    // Fetch volunteer with person and application info to get email
    let email = null;
    if (existingCheck.volunteerId) {
      const volunteer = await prisma.volunteer.findUnique({
        where: { id: existingCheck.volunteerId },
        select: {
          Person: {
            select: { emailAddress: true },
          },
          applicationId: true,
        },
      });

      if (volunteer?.Person?.emailAddress) {
        email = volunteer.Person.emailAddress;
      } else if (volunteer?.applicationId) {
        const application = await prisma.volunteerApplication.findUnique({
          where: { id: volunteer.applicationId },
          select: { email: true },
        });
        email = application?.email;
      }
    }

    // Update the background check
    const backgroundCheck = await prisma.volunteerBackgroundCheck.update({
      where: { id },
      data: {
        status,
        declineReason: status === "DECLINED" ? declineReason : null,
      },
    });

    // Extract first name from full name
    const firstName = existingCheck.fullName.split(" ")[0];

    // Send appropriate email if email exists
    let emailSent = false;
    if (email) {
      try {
        if (status === "APPROVED") {
          await sendApplicationApprovalEmail(email, firstName);
          emailSent = true;
        } else if (status === "DECLINED") {
          await sendApplicationRejectionEmail(email, firstName, declineReason);
          emailSent = true;
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the request if email fails, but log it
      }
    }

    return NextResponse.json(
      {
        message: `Background check ${status.toLowerCase()}${emailSent ? ". Email sent." : ""}`,
        data: backgroundCheck,
        emailSent,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error updating background check:", errorMessage);

    if (errorMessage.includes("P2025")) {
      return NextResponse.json({ message: "Background check not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
