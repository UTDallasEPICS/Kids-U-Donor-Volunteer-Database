import prisma, { prismaSoftDelete } from "@/app/utils/db";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Create
export async function POST(request: Request) {
  try {
    const grantor = await request.json();

    if (
      !grantor?.type ||
      !grantor?.communicationPreference ||
      !grantor?.recognitionPreference ||
      !grantor?.internalRelationshipManager ||
      !grantor?.organization?.name ||
      !grantor?.representative?.positionTitle ||
      !grantor?.representative?.person?.firstName ||
      !grantor?.representative?.person?.lastName ||
      !grantor?.representative?.person?.emailAddress
    ) {
      return NextResponse.json({ message: "Missing required grantor fields" }, { status: 400 });
    }

    if (
      grantor.organization?.emailAddress &&
      (typeof grantor.organization.emailAddress !== "string" || !EMAIL_REGEX.test(grantor.organization.emailAddress.trim().toLowerCase()))
    ) {
      return NextResponse.json({ message: "Invalid organization email" }, { status: 400 });
    }

    if (
      typeof grantor.representative.person.emailAddress !== "string" ||
      !EMAIL_REGEX.test(grantor.representative.person.emailAddress.trim().toLowerCase())
    ) {
      return NextResponse.json({ message: "Invalid representative email" }, { status: 400 });
    }

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
            emailAddress: grantor.organization.emailAddress?.trim().toLowerCase(),
          },
        },
        representative: {
          create: {
            positionTitle: grantor.representative.positionTitle,
            person: {
              create: {
                firstName: grantor.representative.person.firstName,
                lastName: grantor.representative.person.lastName,
                emailAddress: grantor.representative.person.emailAddress.trim().toLowerCase(),
              },
            },
          },
        },
        deletedAt: grantor.DateTime,
        status: grantor.status,
      },
    });

    return new Response(JSON.stringify(newGrantor), { status: 201 });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error creating grantor:", errorMessage);

    return NextResponse.json({ message: "Error creating grantor", error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
