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

    const { registration } = requestBody?.data ?? {};
    if (typeof registration !== "boolean") {
      return NextResponse.json({ message: "Registration field must be a boolean" }, { status: 400 });
    }

    const updatedVolunteer = await prisma.volunteer.update({
      where: { id },
      data: { registration },
    });

    console.log("Volunteer registration updated successfully:", updatedVolunteer);

    return NextResponse.json(
      { message: `Updated registration for volunteer with id: ${id}`, data: updatedVolunteer },
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
