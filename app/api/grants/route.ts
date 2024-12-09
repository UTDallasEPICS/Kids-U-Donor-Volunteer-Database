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
export async function GET(req: NextRequest) {
  //For pagination
  const pageParam = req.nextUrl.searchParams.get('page');
  const rowsPerPageParam = req.nextUrl.searchParams.get('rowsPerPage');
  const pageNum = pageParam ? parseInt(pageParam, 10) : 0;
  const rowsPerPageNum = rowsPerPageParam ? parseInt(rowsPerPageParam, 10) : 5;
  //For searching
  const searchCriteriaParam = req.nextUrl.searchParams.get('searchCriteria') || ''; 
  const searchValueParam = req.nextUrl.searchParams.get('searchValue') || '';

  const where: any = {};
  if (searchCriteriaParam && searchValueParam) {
    // Dynamically build the filter based on the criteria and value
    switch (searchCriteriaParam) {
      case "name":
        where.name = {
          contains: searchValueParam,
          mode: "insensitive", 
        };
        break;
      case "grantor":
        //Nested relation
        where.representativeGrant = {
          some: {
            representative: {
              grantor: {
                organization: {
                  name: {
                    contains: searchValueParam,
                    mode: "insensitive",
                  }
                }
              }
            }
          }
        };
        break;
      case "status":
        where.status = {
          contains: searchValueParam,
          mode: "insensitive", 
        };
        break;
      default:
        break; // No filter
    }
  }

  try {
    const data = await prisma.grant.findMany({
      skip: pageNum * rowsPerPageNum,
      take: rowsPerPageNum,
      where, // Applies search filters if any
      include: {
        representativeGrant: {
          include: {
            representative: {
              include: {
                person: true,
                grantor: {
                  include: {
                    organization: true,
                  }
                }
              }
            }
          }
        }
      }
    });
    const count = await prisma.grant.count({
      where,
    });
  
    return NextResponse.json(
      { message: 'GET REQUEST', data: data, count: count},
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error fetching grants', error: error },
      { status: 500 }
    );
  }
}

// Update

// Delete
