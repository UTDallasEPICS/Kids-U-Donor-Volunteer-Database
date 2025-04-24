import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

// Route handlers are being used (Newer), not API Routes, so we have to use NextRequest/NextResponse

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
      case "email":
        where.organization = {
          contains: searchValueParam,
          mode: "insensitive",
        };
        break;
      case "phone":
        where.organization = {
          contains: searchValueParam,
          mode: "insensitive",
        };
        break;
      case "website":
        where.organization = {
          contains: searchValueParam,
          mode: "insensitive",
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

/*export async function GET1(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const data = await prisma.grantor.findUnique({
      where: {
        id: id,
      },
      include: {
        organization: {
          include: {
            address: true,
          },
        },
      },
    });
    console.log(data);

    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching grantor with ID: ", id);
    return NextResponse.json({ message: "Grantor item not found" }, { status: 404 });
  }
}*/
