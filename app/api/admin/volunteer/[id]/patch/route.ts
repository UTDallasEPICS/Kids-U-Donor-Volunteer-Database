import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

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

    // Parse array fields if they come as strings
    const parseArrayField = (field: any): string[] => {
      if (Array.isArray(field)) return field;
      if (typeof field === "string") return field.split(",").map((s) => s.trim());
      return [];
    };

    // Parse boolean fields
    const parseBoolean = (value: any): boolean => {
      if (typeof value === "boolean") return value;
      if (value === "true" || value === "1") return true;
      if (value === "false" || value === "0") return false;
      return false;
    };

    // Build update data - only include fields that are defined
    const updateData: Record<string, any> = {};

    // Personal Information
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.middleInitial !== undefined) updateData.middleInitial = data.middleInitial;
    if (data.emailAddress !== undefined) updateData.emailAddress = data.emailAddress;
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
    if (data.addressLine !== undefined) updateData.addressLine = data.addressLine;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.zipCode !== undefined) updateData.zipCode = data.zipCode;

    // Work/Education
    if (data.businessOrSchoolName !== undefined) updateData.businessOrSchoolName = data.businessOrSchoolName;

    // Preferences
    if (data.volunteerPreference !== undefined) updateData.volunteerPreference = data.volunteerPreference;
    if (data.preferredRoles !== undefined)
      updateData.preferredRoles = parseArrayField(data.preferredRoles);
    if (data.availability !== undefined) updateData.availability = parseArrayField(data.availability);
    if (data.location !== undefined) updateData.location = parseArrayField(data.location);
    if (data.preferredEvents !== undefined)
      updateData.preferredEvents = parseArrayField(data.preferredEvents);
    if (data.referenceName !== undefined) updateData.referenceName = data.referenceName;

    // Skills & Attributes
    if (data.usCitizen !== undefined) updateData.usCitizen = parseBoolean(data.usCitizen);
    if (data.driversLicense !== undefined) updateData.driversLicense = parseBoolean(data.driversLicense);
    if (data.reliableTransport !== undefined)
      updateData.reliableTransport = parseBoolean(data.reliableTransport);
    if (data.speakSpanish !== undefined) updateData.speakSpanish = parseBoolean(data.speakSpanish);

    // Compliance
    if (data.volunteerApplicationCompleted !== undefined)
      updateData.volunteerApplicationCompleted = parseBoolean(data.volunteerApplicationCompleted);
    if (data.backgroundCheckCompleted !== undefined)
      updateData.backgroundCheckCompleted = parseBoolean(data.backgroundCheckCompleted);
    if (data.codeOfEthicsFormSigned !== undefined)
      updateData.codeOfEthicsFormSigned = parseBoolean(data.codeOfEthicsFormSigned);
    if (data.abuseNeglectReportFormSigned !== undefined)
      updateData.abuseNeglectReportFormSigned = parseBoolean(data.abuseNeglectReportFormSigned);
    if (data.personnelPoliciesFormSigned !== undefined)
      updateData.personnelPoliciesFormSigned = parseBoolean(data.personnelPoliciesFormSigned);
    if (data.orientationCompleted !== undefined)
      updateData.orientationCompleted = parseBoolean(data.orientationCompleted);
    if (data.trainingModulesCompleted !== undefined)
      updateData.trainingModulesCompleted = parseBoolean(data.trainingModulesCompleted);
    if (data.volunteerApplicationStatus !== undefined)
      updateData.volunteerApplicationStatus = data.volunteerApplicationStatus;
    if (data.registration !== undefined) updateData.registration = parseBoolean(data.registration);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No valid fields provided for update" }, { status: 400 });
    }

    const updatedVolunteer = await prisma.volunteer.update({
      where: { id },
      data: updateData,
    });

    console.log("Volunteer updated successfully:", updatedVolunteer);

    return NextResponse.json(
      { message: `Updated volunteer with id: ${id}`, data: updatedVolunteer },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error updating volunteer with ID:", id, errorMessage);

    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ message: "Volunteer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Internal server error", error: errorMessage }, { status: 500 });
  }
}