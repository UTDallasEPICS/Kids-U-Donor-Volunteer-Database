import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S{8,}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, email: rawEmail, username, password, firstName, lastName, locationId, location } = body;
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    if (!id || !email || !username || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return NextResponse.json(
        { error: "Password must be 8+ characters and include uppercase, lowercase, number, and special character" },
        { status: 400 }
      );
    }

    // Check if account already exists with this username
    const existingAccount = await prisma.admin.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });
    if (existingAccount) {
      return NextResponse.json(
        {
          error: "An account with this username or email already exists",
        },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create admin account
    const adminAccount = await prisma.admin.create({
      data: {
        id,
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        locationId,
        location,
      },
    });

    return NextResponse.json({ message: "Admin account created successfully", id: adminAccount.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating admin account:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


