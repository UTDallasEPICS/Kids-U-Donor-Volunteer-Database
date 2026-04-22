import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { sendApplicationRejectionEmail } from "@/app/utils/email";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const { declineReason } = body;

    // First get the background check details to get volunteer info
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

    const bgc = await prisma.volunteerBackgroundCheck.update({
      where: { id },
      data: {
        status: "DECLINED",
        declineReason: declineReason || null,
      },
      select: { volunteerId: true },
    });

    if (bgc.volunteerId) {
      await prisma.volunteer.update({
        where: { id: bgc.volunteerId },
        data: { backgroundCheckCompleted: false },
      });
    }

    // Send rejection email if email exists
    let emailSent = false;
    if (email) {
      try {
        const firstName = existingCheck.fullName.split(" ")[0];
        console.log("Attempting to send rejection email to:", email, "for:", firstName, "reason:", declineReason);
        await sendApplicationRejectionEmail(email, firstName, declineReason);
        console.log("Rejection email sent successfully to:", email);
        emailSent = true;
      } catch (emailError) {
        console.error("Error sending rejection email:", emailError);
        // Don't fail the request if email fails, but log it
      }
    } else {
      console.log("No email found for volunteer:", existingCheck.volunteerId);
    }

    return NextResponse.json(
      {
        message: `Background check rejected${emailSent ? ". Email sent." : ""}`,
        volunteerUpdated: !!bgc.volunteerId,
        emailSent,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error rejecting background check:", id, errorMessage);

    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
