import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { sendApplicationRejectionEmail } from "@/app/utils/email";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    if (!id) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    const requestBody = await req.json().catch(() => null);
    const rejectionReason = requestBody?.rejectionReason || undefined;

    // Fetch the application to get applicant details before rejecting
    const application = await prisma.volunteerApplication.findUnique({
      where: { id },
      select: {
        email: true,
        legalName: true,
        status: true,
      },
    });

    if (!application) {
      return NextResponse.json({ message: "Volunteer application not found" }, { status: 404 });
    }

    // Update the application status to REJECTED
    const rejectedApplication = await prisma.volunteerApplication.update({
      where: { id },
      data: { status: "REJECTED", softdelete: true },
    });

    console.log("Rejected volunteer application:", rejectedApplication);

    // Extract first name from legal name
    const firstName = application.legalName.split(" ")[0] || "Applicant";

    // Send rejection email
    try {
      await sendApplicationRejectionEmail(
        application.email,
        firstName,
        rejectionReason
      );
      console.log("Rejection email sent successfully to:", application.email);
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
      // Don't fail the request if email fails, but log the error
    }

    return NextResponse.json(
      {
        message: `Volunteer application with ID ${id} rejected successfully. Rejection email sent.`,
        data: rejectedApplication,
        emailSent: true,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error rejecting volunteer application:", errorMessage);

    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Volunteer application not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
