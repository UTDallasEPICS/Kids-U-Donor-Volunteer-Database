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

    const { grant } = requestBody?.data ?? {};
    if (!grant || typeof grant !== "object") {
      return NextResponse.json({ message: "Grant data is missing or invalid" }, { status: 400 });
    }

    const updatedGrant = await prisma.grant.update({
      where: { id: id },
      data: grant,
    });

    console.log("Grant updated successfully:", updatedGrant);

    return NextResponse.json({ message: `Updated grant with id: ${id}`, data: updatedGrant }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error updating grant with ID:", id, errorMessage);

    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Grant item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}
