import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    const deletedApplication = await prisma.volunteerApplication.delete({
      where: { id },
    });

    console.log("Deleted volunteer application:", deletedApplication);

    return NextResponse.json(
      { message: `Volunteer application with ID ${id} deleted successfully.`, data: deletedApplication },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error deleting volunteer application:", errorMessage);

    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Volunteer application not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
