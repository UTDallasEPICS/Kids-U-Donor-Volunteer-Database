import prisma from '../../../../utils/prisma';
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  
  try {
    const {
        data: { grant },
    } = await req.json();

    const updatedData = await prisma.grant.update({
      where: {
        id: id,
      },
      data: grant, /*{
          ...grant, 
          representativeGrants: {
            update: grant.representativeGrants?.map((repGrant: any) => ({
              where: {
                grantId: id, 
                representativeId: repGrant.representativeId, 
              },
              data: {
                representative: {
                  update: {
                    person: {
                      update: {
                        firstName: repGrant.representative.person.firstName,
                        lastName: repGrant.representative.person.lastName,
                        emailAddress: repGrant.representative.person.emailAddress,
                        phoneNumber: repGrant.representative.person.phoneNumber,
                      },
                    },
                    grantor: {
                      update: {
                        organization: {
                          update: {
                            name: repGrant.representative.grantor.organization.name,
                          },
                        },
                      },
                    },
                  },
                },
              },
            })),
          },
        },*/
    });
    console.log(updatedData)
    return NextResponse.json(
      { message: "Updated grant with id:", id: id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching grant with ID: ", id);
    return NextResponse.json(
      { message: "Grant item not found" },
      { status: 404 }
    );
  }
}