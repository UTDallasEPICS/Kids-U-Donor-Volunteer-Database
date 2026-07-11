import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const grantor = await req.json();
    const id: string = grantor.id;

    const updatedGrantor = await prisma.grantor.update({
      where: { id },
      data: {
        type: grantor.type,
        websiteLink: grantor.websiteLink,
        communicationPreference: grantor.communicationPreference,
        recognitionPreference: grantor.recognitionPreference,
        internalRelationshipManager: grantor.internalRelationshipManager,
        organization: grantor.organizationId ? { connect: { id: grantor.organizationId } } : undefined, // Only update if provided
      },
    });

    return NextResponse.json({ data: updatedGrantor }, { status: 200 });
  } catch (error) {
    console.error("Error updating grantor:", error);
    return NextResponse.json({ message: "Grantor item not found or update failed" }, { status: 404 });
  }
}
