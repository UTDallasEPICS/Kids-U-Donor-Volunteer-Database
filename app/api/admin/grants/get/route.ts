import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

// Read
export async function GET(req: NextRequest) {
  //For searching
  const searchCriteriaParam = req.nextUrl.searchParams.get("searchCriteria") || "";
  const searchValueParam = req.nextUrl.searchParams.get("searchValue") || "";

  const where: any = {};
  if (searchCriteriaParam && searchValueParam) {
    // Dynamically build the filter based on the criteria and value
    switch (searchCriteriaParam) {
      case "name":
        where.name = {
          contains: searchValueParam,
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
                  },
                },
              },
            },
          },
        };
        break;
      case "status":
        where.status = {
          contains: searchValueParam,
        };
        break;
      default:
        break; // No filter
    }
  }

  try {
    const data = await prisma.grant.findMany({
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
                  },
                },
              },
            },
          },
        },
      },
    });
    const count = await prisma.grant.count({
      where,
    });
    console.log(data);

    return NextResponse.json({ message: "GET REQUEST", data: data, count: count }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching grants", error: error }, { status: 500 });
  }
}
