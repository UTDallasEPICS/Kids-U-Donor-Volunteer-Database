import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const {
      data: { grant },
    } = await req.json();

    const updatedGrant = await prisma.grant.update({
      where: { id },
      data: {
        ...grant,
        amountRequested:
          typeof grant.amountRequested === "string"
            ? parseFloat(grant.amountRequested)
            : grant.amountRequested,
        amountAwarded:
          typeof grant.amountAwarded === "string"
            ? parseFloat(grant.amountAwarded)
            : grant.amountAwarded,
      },
    });

    return NextResponse.json(
      { message: `Successfully updated grant with ID: ${id}`, data: updatedGrant },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error updating grant with ID: ${id}\n`, error);
    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Grant not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const deletedGrant = await prisma.grant.delete({ where: { id } });

    return NextResponse.json(
      { message: `Deleted grant with id: ${id}`, data: deletedGrant },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting grant with ID: ${id}\n`, error);
    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Grant not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
