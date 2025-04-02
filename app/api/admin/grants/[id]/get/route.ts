import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

// Route handlers are being used (Newer), not API Routes, so we have to use NextRequest/NextResponse
// This file will handle single item operations

// Fetch single Grant based on id, Ex. http://localhost:3000/api/grants/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const data = await prisma.grant.findUnique({
      where: {
        id: id,
      },

      include: {
        representativeGrant: {
          include: {
            representative: {
              include: {
                person: true,
                grantor: {
                  include: {
                    organization: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    console.log(data);

    if (!data) {
      return NextResponse.json({ message: "Grant not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Successfully fetched grant with ID: ${id}`, data: data }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching grant with ID: ${id}\n`, id);
    return NextResponse.json({ message: "Grant not found" }, { status: 404 });
  }
}

// Update single Grant based on id
/*export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await req.json();
    //const bodyData = JSON.parse(body) as GrantData;


    const updatedData = await prisma.grant.update({
      where: {
        GrantID: id,
      },
      data: bodyData,
    });

    return NextResponse.json(
      { message: "Updated grant with id:", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching grant with ID: ", id);
    return NextResponse.json(
      { message: "Grant item not found" },
      { status: 404 }
    );
  }
}

// Delete single Grant based on id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const data = await prisma.grant.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: "Deleted data:", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting grant with ID: ", id);
    return NextResponse.json(
      { message: "Grant item not found" },
      { status: 404 }
    );
  }
}*/
