import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S{8,}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email: rawEmail,
      phoneNumber,
      username,
      password,
      // Other volunteer fields
      addressLine,
      city,
      state,
      zipCode,
      usCitizen,
      driversLicense,
      reliableTransport,
      speakSpanish,
      referenceName,
    } = body;

    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    if (!firstName || !lastName || !email || !username || !password) {
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

    // Check if volunteer account already exists with this email or username
    const existingAccount = await prisma.volunteerAccount.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (existingAccount) {
      return NextResponse.json(
        {
          error: "An account with this email or username already exists",
        },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create volunteer and account in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create volunteer first
      const volunteer = await prisma.volunteer.create({
        data: {
          firstName,
          lastName,
          emailAddress: email,
          phoneNumber,
          addressLine,
          city,
          state,
          zipCode,
          usCitizen: usCitizen || false,
          driversLicense: driversLicense || false,
          reliableTransport: reliableTransport || false,
          speakSpanish: speakSpanish || false,
          referenceName,
        },
      });

      // Create volunteer account
      const account = await prisma.volunteerAccount.create({
        data: {
          username,
          password: hashedPassword,
          email,
          volunteerId: volunteer.id,
        },
      });

      return { volunteer, account };
    });

    return NextResponse.json(
      {
        id: result.volunteer.id,
        firstName: result.volunteer.firstName,
        lastName: result.volunteer.lastName,
        email: result.volunteer.emailAddress,
        username: result.account.username,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "Registration failed",
      },
      { status: 500 }
    );
  }
}
