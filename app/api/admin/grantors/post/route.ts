import prisma, { prismaSoftDelete } from "@/app/utils/db";
import { PrismaClient } from "@prisma/client";
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

    return new Response(JSON.stringify(newGrantor), { status: 201 });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error creating grantor:", errorMessage);

    return NextResponse.json({ message: "Error creating grantor", error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
