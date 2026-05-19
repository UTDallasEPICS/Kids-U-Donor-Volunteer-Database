import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join, extname } from "path";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
};
const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "avatars");

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

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 2MB)" }, { status: 413 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    // Delete old file if extension differs (avoids orphaned files)
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarPath: true },
    });
    if (existingUser?.avatarPath) {
      const oldExt = extname(existingUser.avatarPath).slice(1);
      if (oldExt !== ext) {
        const oldFilePath = join(process.cwd(), "public", existingUser.avatarPath);
        await unlink(oldFilePath).catch(() => {});
      }
    }

    // Write file — named <userId>.<ext>, overwrites on same extension
    const filename = `${userId}.${ext}`;
    const fileBytes = new Uint8Array(await file.arrayBuffer());
    await writeFile(join(UPLOAD_DIR, filename), fileBytes);

    const avatarPath = `/uploads/avatars/${filename}`;
    await prisma.user.update({
      where: { id: userId },
      data: { avatarPath },
    });

    return NextResponse.json({ success: true, avatarPath }, { status: 200 });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
