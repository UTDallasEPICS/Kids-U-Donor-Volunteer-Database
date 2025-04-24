// pages/api/volunteer/create-volunteer.js
import prisma from "@/app/utils/db"; // Assuming your Prisma instance is exported here
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      applicationId,
      volunteerPreference,
      preferredRoles,
      availability,
      location,
      preferredEvents,
      volunteerApplicationCompleted,
      backgroundCheckCompleted,
      codeOfEthicsFormSigned,
      abuseNeglectReportFormSigned,
      personnelPoliciesFormSigned,
      orientationCompleted,
      trainingModulesCompleted,
    } = data;

    if (!applicationId) {
      return NextResponse.json({ error: "Missing applicationId" }, { status: 400 });
    }

    // Find the volunteer application
    const application = await prisma.volunteerApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Create the volunteer record
    const volunteer = await prisma.volunteer.create({
      data: {
        firstName: application.legalName.split(" ")[0],
        middleInitial: null, // Optionally handle middle initial
        lastName: application.legalName.split(" ").slice(1).join(" "), // Handle last name from the full name
        addressLine: application.currentAddress,
        city: "", // Needs to be manually collected or parsed
        state: "", // Needs to be manually collected or parsed
        zipCode: "", // Needs to be manually collected or parsed
        phoneNumber: application.phoneNumber,
        emailAddress: application.email,
        businessOrSchoolName: null, // If applicable, manually collect or parse
        volunteerPreference,
        preferredRoles,
        availability,
        location,
        preferredEvents,
        volunteerApplicationCompleted,
        backgroundCheckCompleted,
        codeOfEthicsFormSigned,
        abuseNeglectReportFormSigned,
        personnelPoliciesFormSigned,
        orientationCompleted,
        trainingModulesCompleted,
        applicationId: application.id,
      },
    });

    return NextResponse.json({ message: "Volunteer created successfully", id: volunteer.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating volunteer:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
