import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      include: {
        location: true,
        eventRegistrations: {
          include: {
            volunteer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                emailAddress: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
      orderBy: {
        schedule: "desc",
      },
    });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Error fetching events" }, { status: 500 });
  }
}
