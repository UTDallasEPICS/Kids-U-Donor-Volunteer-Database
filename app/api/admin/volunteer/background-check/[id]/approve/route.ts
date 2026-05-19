import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const backgroundCheck = await prisma.volunteerBackgroundCheck.update({
      where: { id },
      data: { status: "APPROVED" },
      select: { id: true, status: true },
    });

    return NextResponse.json({ message: "Background check approved", data: backgroundCheck }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error approving background check:", id, errorMessage);

    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
