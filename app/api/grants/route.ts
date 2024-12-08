import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// Route handlers are being used (Newer), not API Routes, so we have to use NextRequest/NextResponse

const prisma = new PrismaClient();

// Create
export async function POST(req: NextRequest) {
  try {
    const body = req.json();

    return NextResponse.json(
      {
        message: 'POST REQUEST',
        receivedData: body,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST ERROR:', error);
  }
}

// Read
export async function GET() {
  const data = await prisma.grant.findMany({
    select: {
      representativeGrant: {
        select: {
          representative: {
            select: {
              person: {
                select: {
                  firstName: true,
                  lastName: true,
                }
              },
              grantor: {
                select: {
                  organization: {
                    select: {
                      name: true,
                    }
                  }
                }
              }
            }
          }
        }
      },
      id: true,
      name: true,
      status: true,
      purpose: true,
      startDate: true,
      endDate: true,
      awardNotificationDate: true,
      amountAwarded: true,
      amountRequested: true,
      proposalDueDate: true,
      proposalSubmissionDate: true,
    }
  });

  return NextResponse.json(
    { message: 'GET REQUEST', data: data },
    { status: 200 }
  );
}

// Update

// Delete
