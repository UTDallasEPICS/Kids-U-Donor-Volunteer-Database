import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    const rejectedApplication = await prisma.volunteerApplication.update({
      where: { id },
      data: { status: "REJECTED", softdelete: true },
    });

    console.log("Rejected volunteer application:", rejectedApplication);

    return NextResponse.json(
      { message: `Volunteer application with ID ${id} rejected successfully.`, data: rejectedApplication },
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
