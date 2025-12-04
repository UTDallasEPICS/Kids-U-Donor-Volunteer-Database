// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'; 
import { send2FACode, generate2FACode } from '../../../utils/email'; 

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = '7d'; 
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; 

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, twoFactorCode } = await request.json(); 

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        verified: true, 
        twoFactorEnabled: true, 
        twoFactorCode: true, 
        twoFactorExpiry: true, 
        person: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.verified) {
      return NextResponse.json(
        {
          error: 'Email not verified',
          message: 'Please verify your email before logging in. Check your inbox for the verification link.',
          requiresVerification: true,
        },
        { status: 403 }
      );
    }

    if (user.twoFactorEnabled) {
      if (twoFactorCode) {
        if (!user.twoFactorCode || !user.twoFactorExpiry) {
          return NextResponse.json(
            { error: 'No 2FA code has been sent. Please try logging in again.' },
            { status: 400 }
          );
        }

        if (user.twoFactorExpiry < new Date()) {
          return NextResponse.json(
            { error: '2FA code has expired. Please request a new one.' },
            { status: 400 }
          );
        }

        if (user.twoFactorCode !== twoFactorCode) {
          return NextResponse.json(
            { error: 'Invalid 2FA code' },
            { status: 401 }
          );
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            twoFactorCode: null,
            twoFactorExpiry: null,
          },
        });
      } else {
        const code = generate2FACode();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.user.update({
          where: { id: user.id },
          data: {
            twoFactorCode: code,
            twoFactorExpiry: expiry,
          },
        });

        try {
          await send2FACode(user.email, code, user.person?.firstName || 'User');
        } catch (emailError) {
          console.error('Failed to send 2FA code:', emailError);
          return NextResponse.json(
            { error: 'Failed to send 2FA code. Please try again.' },
            { status: 500 }
          );
        }

        return NextResponse.json(
          {
            requires2FA: true,
            message: 'A verification code has been sent to your email.',
          },
          { status: 200 }
        );
      }
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET!, 
      { expiresIn: TOKEN_EXPIRY } 
    );

    const cookieStore = await cookies(); 
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: TOKEN_MAX_AGE_SECONDS,
      path: '/',
      sameSite: 'lax', 
    });
    
    // Return user data (excluding password) and token
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.person?.firstName,
          lastName: user.person?.lastName,
          verified: user.verified, 
          twoFactorEnabled: user.twoFactorEnabled, 
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally { 
    await prisma.$disconnect();
  }
}