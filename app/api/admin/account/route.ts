import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, email, username, password, firstName, lastName, locationId, location } = body;
    // Check if account already exists with this username
    const existingAccount = await prisma.admin.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });
    if (existingAccount) {
      return NextResponse.json(
        {
          error: "An account with this username already exists",
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
