import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_AVATAR_URL_LENGTH = 2048;

const isAllowedAvatarUrl = (value: string) => {
  if (value.startsWith("data:")) return false;
  if (value.startsWith("/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

function parseName(name: string, fallbackLastName: string | null) {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : fallbackLastName ?? "User";

  return { firstName, lastName };
}

export async function POST(request: NextRequest) {
  try {
    const userPayload = request.headers.get("x-user-payload");
    if (!userPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(userPayload);
    const body = await request.json();

    const { name, email, phone, avatar } = body ?? {};

    if (name !== undefined && typeof name !== "string") {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    if (email !== undefined && typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (phone !== undefined && typeof phone !== "string") {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }
    if (avatar !== undefined && typeof avatar !== "string") {
      return NextResponse.json({ error: "Invalid avatar" }, { status: 400 });
    }

    const trimmedEmail = typeof email === "string" ? email.trim() : undefined;
    if (trimmedEmail && !EMAIL_RE.test(trimmedEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        person: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const nameParts = typeof name === "string" ? parseName(name, user.person?.lastName ?? null) : null;

    if (typeof name === "string" && !nameParts) {
      return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
    }

    const userUpdateData: Record<string, unknown> = {};
    const personUpdateData: Record<string, unknown> = {};

    if (trimmedEmail) {
      userUpdateData.email = trimmedEmail;
      personUpdateData.emailAddress = trimmedEmail;
    }

    if (typeof avatar === "string") {
      const trimmedAvatar = avatar.trim();
      if (trimmedAvatar === "") {
        userUpdateData.avatarUrl = null;
      } else if (trimmedAvatar.length > MAX_AVATAR_URL_LENGTH) {
        return NextResponse.json({ error: "Avatar URL is too long" }, { status: 400 });
      } else if (!isAllowedAvatarUrl(trimmedAvatar)) {
        return NextResponse.json({ error: "Invalid avatar URL" }, { status: 400 });
      } else {
        userUpdateData.avatarUrl = trimmedAvatar;
      }
    }

    if (nameParts) {
      personUpdateData.firstName = nameParts.firstName;
      personUpdateData.lastName = nameParts.lastName;
    }

    if (typeof phone === "string") {
      const trimmedPhone = phone.trim();
      personUpdateData.phoneNumber = trimmedPhone === "" ? null : trimmedPhone;
    }

    if (user.person) {
      if (Object.keys(personUpdateData).length > 0) {
        userUpdateData.person = { update: personUpdateData };
      }
    } else if (Object.keys(personUpdateData).length > 0) {
      const firstName = personUpdateData.firstName as string | undefined;
      const lastName = personUpdateData.lastName as string | undefined;
      const emailAddress = (personUpdateData.emailAddress as string | undefined) ?? user.email;

      if (!firstName || !lastName || !emailAddress) {
        return NextResponse.json(
          { error: "Name and email are required to create a profile" },
          { status: 400 }
        );
      }

      userUpdateData.person = {
        create: {
          firstName,
          lastName,
          emailAddress,
          phoneNumber: personUpdateData.phoneNumber ?? null,
        },
      };
    }

    if (Object.keys(userUpdateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userUpdateData,
      select: {
        id: true,
        email: true,
        avatarUrl: true,
        person: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
            emailAddress: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          avatar: updatedUser.avatarUrl || null,
          firstName: updatedUser.person?.firstName ?? null,
          lastName: updatedUser.person?.lastName ?? null,
          phone: updatedUser.person?.phoneNumber ?? "",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Email or phone already in use" }, { status: 409 });
    }
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
