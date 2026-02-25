import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
};

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const userPayload = request.headers.get("x-user-payload");
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(userPayload);
    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Avatar file is required" }, { status: 400 });
    }

    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 2MB)" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    await prisma.user.update({
      where: { id: userId },
      data: {
        avatarData: buffer,
        avatarMimeType: file.type,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userPayload = request.headers.get("x-user-payload");
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(userPayload);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        avatarData: true,
        avatarMimeType: true,
      },
    });

    if (!user?.avatarData) {
      return NextResponse.json({ error: "No avatar found" }, { status: 404 });
    }

    return new NextResponse(user.avatarData, {
      status: 200,
      headers: {
        "Content-Type": user.avatarMimeType || "image/png",
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (error) {
    console.error("Avatar fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
