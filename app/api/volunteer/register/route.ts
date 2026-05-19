import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      error: "This endpoint is deprecated. Please use /api/auth/register.",
    },
    { status: 410 }
  );
}

// Could be removed
