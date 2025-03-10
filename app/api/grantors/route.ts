import prisma, { prismaSoftDelete } from "@/app/utils/db";

import { grantors } from "@/app/utils/grantorTestData";
import { PrismaClient } from "@prisma/client";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

// Create
export async function POST(request: Request) {
  try {
    const grantor = await request.json();

    const newGrantor = await prisma.grantor.create({
      data: {
        type: grantor.type,
        websiteLink: grantor.websiteLink,
        communicationPreference: grantor.communicationPreference,
        recognitionPreference: grantor.recognitionPreference,
        internalRelationshipManager: grantor.internalRelationshipManager,
        organization: {
          create: {
            name: grantor.organization.name,
            emailAddress: grantor.organization.emailAddress,
          },
        },
        representative: {
          create: {
            positionTitle: grantor.representative.positionTitle,
            person: {
              create: {
                firstName: grantor.representative.person.firstName,
                lastName: grantor.representative.person.lastName,
                emailAddress: grantor.representative.person.emailAddress,
              },
            },
          },
        },
        deletedAt: grantor.DateTime,
        status: grantor.status,
      },
    });
    return new Response(JSON.stringify(newGrantor));
  } catch (error) {
    return new Response("{Error: ${error.message}", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Read
export async function GET(req: NextRequest) {
  //For pagination
  const pageParam = req.nextUrl.searchParams.get("page");
  const rowsPerPageParam = req.nextUrl.searchParams.get("rowsPerPage");
  const pageNum = pageParam ? parseInt(pageParam, 10) : 0;
  const rowsPerPageNum = rowsPerPageParam ? parseInt(rowsPerPageParam, 10) : 5;
  //For searching
  const searchCriteriaParam = req.nextUrl.searchParams.get("searchCriteria") || "";
  const searchValueParam = req.nextUrl.searchParams.get("searchValue") || "";

  const where: any = {};
  if (searchCriteriaParam && searchValueParam) {
    // Dynamically build the filter based on the criteria and value
    switch (searchCriteriaParam) {
      case "name":
        where.organization = {
          name: {
            contains: searchValueParam,
            mode: "insensitive",
          },
        };
        break;
      case "type":
        where.type = {
          contains: searchValueParam,
          mode: "insensitive",
        };
        break;
      case "addressLine1":
        where.organization = {
          address: {
            addressLine1: {
              contains: searchValueParam,
              mode: "insensitive",
            },
          },
        };
        break;
      case "city":
        where.organization = {
          address: {
            city: {
              contains: searchValueParam,
              mode: "insensitive",
            },
          },
        };
        break;
      case "state":
        where.organization = {
          address: {
            state: {
              contains: searchValueParam,
              mode: "insensitive",
            },
          },
        };
        break;
      case "zipcode":
        where.organization = {
          address: {
            zipCode: {
              contains: searchValueParam,
              mode: "insensitive",
            },
          },
        };
        break;
      default:
        break; // No filter
    }
  }

  try {
    const data = await prisma.grantor.findMany({
      skip: pageNum * rowsPerPageNum,
      take: rowsPerPageNum,
      where, // Applies search filters if any
      include: {
        organization: {
          include: {
            address: true,
          },
        },
      },
    });
    const count = await prisma.grantor.count({
      where,
    });

    return NextResponse.json({ message: "GET REQUEST", data: data, count: count }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching grants", error: error }, { status: 500 });
  }
}
