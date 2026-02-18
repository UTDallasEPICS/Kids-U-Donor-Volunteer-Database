import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

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

    const extension = ALLOWED_TYPES[file.type];
    const filename = `${userId}-${randomUUID()}.${extension}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");

    await mkdir(uploadsDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({ success: true, url: `/uploads/avatars/${filename}` }, { status: 200 });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
