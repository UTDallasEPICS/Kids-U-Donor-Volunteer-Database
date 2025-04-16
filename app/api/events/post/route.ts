import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
   
    const body = await req.json();

    
    const eventData = {
      name: body.name,
      description: body.description,
      schedule: body.schedule, 
      locationId: body.locationId || null,
    };

    /
    const event = await prisma.event.create({
      data: eventData,
      include: {
        location: true, 
      },
    });

    
    return NextResponse.json(event, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating event:", error.message);
      console.error("Stack Trace:", error.stack);

      return NextResponse.json({ error: "Error creating event", details: error.message }, { status: 500 });
    } else {
      console.error("Unknown error:", error);

      return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
  }
}
