import prisma from '../../../utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Route handlers are being used (Newer), not API Routes, so we have to use NextRequest/NextResponse

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
      case "donor":
        where.OR = [{
          person: {
            firstName: {
              contains: searchValueParam,
              mode: "insensitive",
            },
          }
        },
        {
          person: {
            lastName: {
              contains: searchValueParam,
              mode: "insensitive",
            }
          }
        },
        { 
          organization: {
            name: {
              contains: searchValueParam,
              mode: "insensitive",
            }
          }
        }];
        break;
      case "campaign":
        where.campaign = {
          contains: searchValueParam,
          mode: "insensitive",
        }
        break;
      case "fundDesignation":
        where.fundDesignation = {
          contains: searchValueParam,
          mode: "insensitive", 
        };
        break;
      default:
        break; // No filter
    }
  }

  try {
    const data = await prisma.donation.findMany({
      skip: pageNum * rowsPerPageNum,
      take: rowsPerPageNum,
      where, // Applies search filters if any
      include: {
        donor:{
            include: {
              person: true,
              organization: true,
            }
        }
      }
    });
    const count = await prisma.donation.count({
      where,
    });
    console.log(data);
  
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
