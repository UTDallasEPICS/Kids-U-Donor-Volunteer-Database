import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    const requestBody = await req.json().catch(() => null);
    if (!requestBody || typeof requestBody !== "object") {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const { accepted } = requestBody?.data ?? {};
    if (typeof accepted !== "boolean") {
      return NextResponse.json({ message: "Registration field must be a boolean" }, { status: 400 });
    }

    const updatedVolunteerApplication = await prisma.volunteerApplication.update({
      where: { id },
      data: { accepted },
    });

    console.log("Volunteer Application updated successfully:", updatedVolunteerApplication);

    // If accepted, send POST request to internal endpoint to create volunteer
    if (accepted) {
      try {
        const response = await fetch("http://localhost:3000/api/admin/volunteer/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ applicationId: id }),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("Failed to create volunteer:", result);
        } else {
          console.log("Volunteer created via internal POST call:", result);
        }
      } catch (postError) {
        console.error("Error making POST request to create volunteer:", postError);
      }
    }

    return NextResponse.json(
      {
        message: `Updated registration for volunteer Application with id: ${id}`,
        data: updatedVolunteerApplication,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error updating volunteer Application registration with ID:", id, errorMessage);

    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Volunteer Application not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
