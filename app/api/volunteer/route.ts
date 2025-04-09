import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Create
export async function POST(req: NextRequest) {
  try {
    const body = req.json();

    return NextResponse.json(
      {
        message: 'POST REQUEST',
        receivedData: body,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST ERROR:', error);
  }
}

// Fetch all representatives
export async function GET() {
  const data = await prisma.volunteer.findMany();

  return NextResponse.json(
    { message: 'GET REQUEST', data: data },
    { status: 200 }
  );
}

// Update a volunteer
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();

    const updatedVolunteer = await prisma.volunteer.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
        { message: 'Volunteer updated successfully', data: updatedVolunteer },
        { status: 200 }
    );
  } catch (error) {
    console.error('PUT ERROR:', error);

    // @ts-ignore
    if (error.code === 'P2025') {
      return NextResponse.json(
          { error: 'Volunteer not found' },
          { status: 404 }
      );
    }

    return NextResponse.json(
        { error: 'Failed to update volunteer' },
        { status: 500 }
    );
  }
}

// Delete a volunteer
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    await prisma.volunteer.delete({
      where: { id },
    });

    return NextResponse.json(
        { message: 'Volunteer deleted successfully' },
        { status: 200 }
    );
  } catch (error) {
    console.error('DELETE ERROR:', error);

    // @ts-ignore
    if (error.code === 'P2025') {
      return NextResponse.json(
          { error: 'Volunteer not found' },
          { status: 404 }
      );
    }

    return NextResponse.json(
        { error: 'Failed to delete volunteer' },
        { status: 500 }
    );
  }
}