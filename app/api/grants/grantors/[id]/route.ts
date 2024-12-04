import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
    ) {
    const { id } = params;
    try {
      const data = await prisma.grantor.findUnique({
        where: {
          id: id,
        },
      });
      console.log(data);
  
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      console.error("Error fetching grant with ID: ", id);
      return NextResponse.json(
        { message: "Grantor item not found" },
        { status: 404 }
      );
    }
  }