import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();

    // Attempt to create a new location in the database
    const location = await prisma.location.create({ data: body });

    // Return the created location with a 201 status code
    return NextResponse.json(location, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating location:", error.message);
      console.error("Stack Trace:", error.stack);

      return NextResponse.json({ error: "Error creating location", details: error.message }, { status: 500 });
    } else {
      console.error("Unknown error:", error);

      return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
  }
}
