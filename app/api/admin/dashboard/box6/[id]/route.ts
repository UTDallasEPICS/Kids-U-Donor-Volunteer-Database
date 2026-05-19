import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: "Task model disabled" }, { status: 410 });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: "Task model disabled" }, { status: 410 });
}

// Could be removed
