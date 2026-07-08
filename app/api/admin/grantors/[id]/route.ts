import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

// Map old/invalid database values to valid ones
const mapGrantorType = (value: string): string => {
  const typeMap: Record<string, string> = {
    "Foundation": "Private Foundation",
    "Private Foundation": "Private Foundation",
    "Corporate Partner": "Corporate Partner",
    "Federal Government": "Federal Government",
    "State Government": "State Government",
    "Local Government": "Local Government",
    "Individual Major Donor": "Individual Major Donor",
  };
  return typeMap[value] || "Private Foundation";
};

const mapCommunicationPreference = (value: string): string => {
  const prefMap: Record<string, string> = {
    "Email": "Email",
    "Phone": "Phone",
    "In-person": "In-person",
    "Event Participation": "Event Participation",
    "Unknown": "Email",
  };
  return prefMap[value] || "Email";
};

const mapRecognitionPreference = (value: string): string => {
  const prefMap: Record<string, string> = {
    "Public Recognition": "Public Recognition",
    "Anonymous": "Anonymous",
    "None": "Public Recognition",
  };
  return prefMap[value] || "Public Recognition";
};

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    if (!id) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    const requestBody = await req.json();

    if (!requestBody || typeof requestBody !== "object") {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const { data } = requestBody;
    if (!data) {
      return NextResponse.json({ message: "No data provided" }, { status: 400 });
    }

    // Extract grantor data (handle nested structure)
    const grantorData = data.grantor || data;

    // Fetch the current grantor to get related IDs
    const currentGrantor = await prisma.grantor.findUnique({
      where: { id },
      include: {
        organization: {
          include: { address: true },
        },
      },
    });

    if (!currentGrantor) {
      console.log("Grantor not found with ID:", id);
      return NextResponse.json({ message: "Grantor not found" }, { status: 404 });
    }

    // Update Address if organization and address exist
    if (
      currentGrantor.organization?.address &&
      grantorData.organization?.address
    ) {
      const addressUpdateData: Record<string, any> = {};

      if (grantorData.organization.address.addressLine1 !== undefined)
        addressUpdateData.addressLine1 = grantorData.organization.address.addressLine1;
      if (grantorData.organization.address.addressLine2 !== undefined)
        addressUpdateData.addressLine2 = grantorData.organization.address.addressLine2;
      if (grantorData.organization.address.city !== undefined)
        addressUpdateData.city = grantorData.organization.address.city;
      if (grantorData.organization.address.state !== undefined)
        addressUpdateData.state = grantorData.organization.address.state;
      if (grantorData.organization.address.zipCode !== undefined)
        addressUpdateData.zipCode = grantorData.organization.address.zipCode;
      if (grantorData.organization.address.type !== undefined)
        addressUpdateData.type = grantorData.organization.address.type;

      if (Object.keys(addressUpdateData).length > 0) {
        try {
          await prisma.address.update({
            where: { id: currentGrantor.organization.address.id },
            data: addressUpdateData,
          });
        } catch (addressError) {
          console.error("Error updating address:", addressError);
          throw addressError;
        }
      }
    } else {
      console.log("Skipping address update - organization or address does not exist");
    }

    // Update Organization if it exists
    if (currentGrantor.organization && grantorData.organization) {
      const organizationUpdateData: Record<string, any> = {};

      if (grantorData.organization.name !== undefined)
        organizationUpdateData.name = grantorData.organization.name;
      if (grantorData.organization.emailAddress !== undefined)
        organizationUpdateData.emailAddress = grantorData.organization.emailAddress;

      if (Object.keys(organizationUpdateData).length > 0) {
        try {
          await prisma.organization.update({
            where: { id: currentGrantor.organization.id },
            data: organizationUpdateData,
          });
        } catch (orgError) {
          console.error("Error updating organization:", orgError);
          throw orgError;
        }
      }
    } else {
      console.log("Skipping organization update - organization does not exist");
    }

    // Update Grantor top-level fields
    const grantorUpdateData: Record<string, any> = {};

    if (grantorData.type !== undefined && grantorData.type !== "")
      grantorUpdateData.type = mapGrantorType(grantorData.type);
    if (grantorData.websiteLink !== undefined)
      grantorUpdateData.websiteLink = grantorData.websiteLink;
    if (grantorData.communicationPreference !== undefined && grantorData.communicationPreference !== "")
      grantorUpdateData.communicationPreference = mapCommunicationPreference(
        grantorData.communicationPreference
      );
    if (grantorData.recognitionPreference !== undefined && grantorData.recognitionPreference !== "")
      grantorUpdateData.recognitionPreference = mapRecognitionPreference(
        grantorData.recognitionPreference
      );
    if (grantorData.internalRelationshipManager !== undefined)
      grantorUpdateData.internalRelationshipManager = grantorData.internalRelationshipManager;

    if (Object.keys(grantorUpdateData).length === 0) {
      // Fetch fresh data to return
      const refreshedGrantor = await prisma.grantor.findUnique({
        where: { id },
        include: {
          organization: {
            include: { address: true },
          },
        },
      });
      return NextResponse.json(
        { message: "No updates needed", data: refreshedGrantor },
        { status: 200 }
      );
    }

    const updatedGrantor = await prisma.grantor.update({
      where: { id },
      data: grantorUpdateData,
      include: {
        organization: {
          include: { address: true },
        },
      },
    });

    return NextResponse.json(
      { message: `Updated grantor with id: ${id}`, data: updatedGrantor },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error updating grantor with ID:", id);
    console.error("Error message:", errorMessage);
    console.error("Full error:", error);

    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Grantor not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    if (!id) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    // Soft delete by setting deletedAt timestamp
    const deletedGrantor = await prisma.grantor.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      include: {
        organization: {
          include: { address: true },
        },
      },
    });

    return NextResponse.json(
      { message: `Deleted grantor with id: ${id}`, data: deletedGrantor },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error deleting grantor with ID:", id, errorMessage);

    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Grantor not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}