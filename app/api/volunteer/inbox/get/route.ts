import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/app/utils/db';

const JWT_SECRET = process.env.JWT_SECRET;

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function GET(request: NextRequest) {
  try {
    if (!JWT_SECRET) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as unknown as JWTPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        person: {
          select: {
            volunteer: { select: { id: true } },
          },
        },
      },
    });

    const volunteerId = user?.person?.volunteer?.id;

    if (!volunteerId) {
      return NextResponse.json({ emails: [], unreadCount: 0 });
    }

    const emails = await prisma.sentEmail.findMany({
      where: { volunteerId },
      orderBy: { sentAt: 'desc' },
    });

    const unreadCount = emails.filter((e) => !e.isRead).length;

    return NextResponse.json({ emails, unreadCount });
  } catch (error) {
    console.error('Get inbox error:', error);
    return NextResponse.json({ error: 'Failed to fetch inbox' }, { status: 500 });
  }
}
