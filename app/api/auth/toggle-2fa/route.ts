// app/api/auth/toggle-2fa/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


export async function POST(request: NextRequest) {
 try {
   const userPayload = request.headers.get('x-user-payload');

   if (!userPayload) {
     return NextResponse.json(
       { error: 'Unauthorized' },
       { status: 401 }
     );
   }

   const { userId } = JSON.parse(userPayload);
   const { enable } = await request.json();


   if (typeof enable !== 'boolean') {
     return NextResponse.json(
       { error: 'Invalid request. "enable" must be a boolean.' },
       { status: 400 }
     );
   }

   const user = await prisma.user.update({
     where: { id: userId },
     data: {
       twoFactorEnabled: enable,
       ...(enable === false && {
         twoFactorCode: null,
         twoFactorExpiry: null,
       }),
     },
     select: {
       id: true,
       email: true,
       twoFactorEnabled: true,
     },
   });


   return NextResponse.json(
     {
       success: true,
       message: `Two-factor authentication has been ${enable ? 'enabled' : 'disabled'}.`,
       twoFactorEnabled: user.twoFactorEnabled,
     },
     { status: 200 }
   );
 } catch (error) {
   console.error('Toggle 2FA error:', error);
   return NextResponse.json(
     { error: 'Internal server error' },
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}
