import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail, generateToken } from '../../../utils/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
    where: { email },
    });

    const existingPerson = await prisma.person.findUnique({
    where: { emailAddress: email },
    });

    if (existingUser || existingPerson) {
    return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
    );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = generateToken();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'VOLUNTEER',
        verified: false,
        verificationToken,
        verificationExpiry,
        person: {
          create: {
            firstName,
            lastName,
            emailAddress: email, 
          },
        },
      },
      include: {
        person: true,
      },
    });

    await sendVerificationEmail(email, verificationToken, firstName);

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        user: {
          id: user.id,
          email: user.email,
          verified: user.verified,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}