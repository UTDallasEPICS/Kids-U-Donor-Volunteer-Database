import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const email = await prisma.sentEmail.update({
      where: { id: params.id },
      data: { isRead: true },
    });
    return NextResponse.json({ email });
  } catch (error) {
    console.error('Mark read error:', error);
    return NextResponse.json({ error: 'Failed to mark email as read' }, { status: 500 });
  }
}
