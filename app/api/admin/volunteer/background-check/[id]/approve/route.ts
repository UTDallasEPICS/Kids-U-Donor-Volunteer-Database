import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const bgc = await prisma.volunteerBackgroundCheck.update({
      where: { id },
      data: { approved: true },
      select: { volunteerId: true },
    });

    if (bgc.volunteerId) {
      await prisma.volunteer.update({
        where: { id: bgc.volunteerId },
        data: { backgroundCheckCompleted: true },
      });
    }

    return NextResponse.json(
      { message: "Background check approved", volunteerUpdated: !!bgc.volunteerId },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error approving background check:", id, errorMessage);

    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
