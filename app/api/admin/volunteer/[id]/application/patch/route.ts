import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    const requestBody = await req.json();
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

    return NextResponse.json(
      { message: `Updated registration for volunteer Application with id: ${id}`, data: updatedVolunteerApplication },
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
