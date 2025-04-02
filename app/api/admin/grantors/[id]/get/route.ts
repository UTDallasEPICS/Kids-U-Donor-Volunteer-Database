import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const data = await prisma.grantor.findUnique({
      where: {
        id: id,
      },
      include: {
        organization: {
          include: {
            address: true,
          },
        },
      },
    });
    console.log(data);

    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching grantor with ID: ", id);
    return NextResponse.json({ message: "Grantor item not found" }, { status: 404 });
  }
}
