import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

// PATCH handler for updates
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const {
      data: { volunteer },
    } = await req.json();

    // Don't update the submission timestamp
    const { dateSubmitted, ...volunteerData } = volunteer;

    // Array fields may come as comma-separated strings from text inputs
    const parseArr = (val: any): string[] =>
      Array.isArray(val) ? val : val ? val.split(",").map((s: string) => s.trim()).filter(Boolean) : [];

    const updatedVolunteer = await prisma.volunteer.update({
      where: { id },
      data: {
        ...volunteerData,
        preferredRoles: JSON.stringify(parseArr(volunteerData.preferredRoles)),
        availability: JSON.stringify(parseArr(volunteerData.availability)),
        location: JSON.stringify(parseArr(volunteerData.location)),
        preferredEvents: JSON.stringify(parseArr(volunteerData.preferredEvents)),
      },
    });

    return NextResponse.json(
      { message: `Successfully updated volunteer with ID: ${id}`, data: updatedVolunteer },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error updating volunteer with ID: ${id}\n`, error);
    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Volunteer not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


// DELETE handler for deletion
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    if (!id) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    const deletedVolunteer = await prisma.volunteer.delete({
      where: { id },
    });

    console.log("Volunteer deleted successfully:", deletedVolunteer);

    return NextResponse.json(
      { message: `Deleted volunteer with id: ${id}`, data: deletedVolunteer },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error deleting volunteer with ID:", id, errorMessage);

    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Volunteer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}