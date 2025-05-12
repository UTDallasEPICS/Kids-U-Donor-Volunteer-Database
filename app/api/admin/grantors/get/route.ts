import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Handle single grantor request
  const id = req.nextUrl.searchParams.get("id");
  if (id) {
    try {
      const grantor = await prisma.grantor.findUnique({
        where: { id },
        include: {
          organization: {
            include: { address: true },
          },
          representative: {
            include: { person: true },
          },
        },
      });

      if (!grantor) {
        return NextResponse.json({ success: false, message: "Grantor not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: grantor,
      });
    } catch (error) {
      console.error("Error fetching grantor:", error);
      return NextResponse.json({ success: false, message: "Error fetching grantor" }, { status: 500 });
    }
  }

  // Handle list request
  const page = Number(req.nextUrl.searchParams.get("page")) || 0;
  const rowsPerPage = Number(req.nextUrl.searchParams.get("rowsPerPage")) || 5;
  const searchCriteria = req.nextUrl.searchParams.get("searchCriteria") || "";
  const searchValue = req.nextUrl.searchParams.get("searchValue") || "";

  const where: any = { deletedAt: null };

  if (searchCriteria && searchValue) {
    switch (searchCriteria) {
      case "name":
        where.organization = {
          name: { contains: searchValue, mode: "insensitive" },
        };
        break;
      case "type":
        where.type = { contains: searchValue, mode: "insensitive" };
        break;
      case "addressLine1":
        where.organization = {
          address: {
            addressLine1: { contains: searchValue, mode: "insensitive" },
          },
        };
        break;
      case "city":
        where.organization = {
          address: {
            city: { contains: searchValue, mode: "insensitive" },
          },
        };
        break;
      case "state":
        where.organization = {
          address: {
            state: { contains: searchValue, mode: "insensitive" },
          },
        };
        break;
      case "zipcode":
        where.organization = {
          address: {
            zipCode: { contains: searchValue, mode: "insensitive" },
          },
        };
        break;
    }
  }

  try {
    const [data, count] = await Promise.all([
      prisma.grantor.findMany({
        skip: page * rowsPerPage,
        take: rowsPerPage,
        where,
        include: {
          organization: {
            include: { address: true },
          },
          representative: {
            include: { person: true },
          },
        },
        orderBy: { id: "desc" },
      }),
      prisma.grantor.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: count,
        page,
        pageSize: rowsPerPage,
        totalPages: Math.ceil(count / rowsPerPage),
      },
    });
  } catch (error) {
    console.error("Error fetching grantors:", error);
    return NextResponse.json({ success: false, message: "Error fetching grantors" }, { status: 500 });
  }
}
