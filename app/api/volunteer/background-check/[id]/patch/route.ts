import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, declineReason } = body;

    if (!status || !["APPROVED", "DECLINED", "PENDING"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status. Must be APPROVED, DECLINED, or PENDING" },
        { status: 400 }
      );
    }

    // Validate decline reason for DECLINED status
    if (status === "DECLINED" && !declineReason?.trim()) {
      return NextResponse.json(
        { message: "Decline reason is required when declining" },
        { status: 400 }
      );
    }

    const backgroundCheck = await prisma.volunteerBackgroundCheck.update({
      where: { id },
      data: {
        status,
        declineReason: status === "DECLINED" ? declineReason : null,
        approved: status === "APPROVED",
      },
    });

    return NextResponse.json(
      {
        message: `Background check ${status.toLowerCase()}`,
        data: backgroundCheck,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error updating background check:", errorMessage);

    if (errorMessage.includes("P2025")) {
      return NextResponse.json(
        { message: "Background check not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
