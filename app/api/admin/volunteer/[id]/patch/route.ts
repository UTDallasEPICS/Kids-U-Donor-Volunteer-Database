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

    const { registration, backgroundCheckCompleted } = requestBody?.data ?? {};

    if (registration !== undefined && typeof registration !== "boolean") {
      return NextResponse.json({ message: "registration field must be a boolean" }, { status: 400 });
    }
    if (backgroundCheckCompleted !== undefined && typeof backgroundCheckCompleted !== "boolean") {
      return NextResponse.json({ message: "backgroundCheckCompleted field must be a boolean" }, { status: 400 });
    }

    const updateData: { registration?: boolean; backgroundCheckCompleted?: boolean } = {};
    if (registration !== undefined) updateData.registration = registration;
    if (backgroundCheckCompleted !== undefined) updateData.backgroundCheckCompleted = backgroundCheckCompleted;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No valid fields provided for update" }, { status: 400 });
    }

    const updatedVolunteer = await prisma.volunteer.update({
      where: { id },
      data: updateData,
    });

    console.log("Volunteer updated successfully:", updatedVolunteer);

    return NextResponse.json(
      { message: `Updated volunteer with id: ${id}`, data: updatedVolunteer },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error updating volunteer registration with ID:", id, errorMessage);

    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Volunteer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
