// app/api/orientations/post/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const { name, description, schedule, capacity, locationId } = body;

    const orientation = await prisma.orientation.create({
      data: {
        name,
        description,
        schedule: new Date(schedule),
        capacity: parseInt(capacity),
        location: {
          connect: { id: locationId },
        },
      },
    });

    return new Response(JSON.stringify(orientation), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create orientation" }), { status: 500 });
  }
}

export async function GET() {
  try {
    const orientations = await prisma.orientation.findMany({
      include: { location: true },
      orderBy: { schedule: "asc" },
    });

    return new Response(JSON.stringify(orientations), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch orientations" }), { status: 500 });
  }
}
