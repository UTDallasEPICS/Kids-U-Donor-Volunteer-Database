import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { sendApplicationApprovalEmail } from "@/app/utils/email";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

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
      data: { status: "APPROVED" },
      select: { volunteerId: true },
    });

    return NextResponse.json(
      {
        message: `Background check approved${emailSent ? ". Email sent." : ""}`,
        volunteerUpdated: !!bgc.volunteerId,
        emailSent,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error approving background check:", id, errorMessage);

    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
