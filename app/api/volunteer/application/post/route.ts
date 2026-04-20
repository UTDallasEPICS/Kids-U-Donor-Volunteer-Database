// pages/api/volunteer/create-application.js
import prisma from "@/app/utils/db"; // Assuming your Prisma instance is exported here
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Log incoming data for debugging
    console.log("Incoming form data:", JSON.stringify(data, null, 2));

    // Validation for absolutely required fields
    if (!data.legalName?.trim() || !data.ssn?.trim() || !data.phoneNumber?.trim() || !data.email?.trim()) {
      return NextResponse.json({ error: "Missing required fields: legalName, ssn, phoneNumber, email" }, { status: 400 });
    }

    // Ensure all required fields have values before creating
    const applicationData = {
      legalName: data.legalName?.trim() || "",
      maidenName: data.maidenName?.trim() || null,
      ssn: data.ssn?.trim() || "",
      preferredName: data.preferredName?.trim() || null,
      currentAddress: data.currentAddress?.trim() || "",
      phoneNumber: data.phoneNumber?.trim() || "",
      email: data.email?.trim() || "",
      usCitizen: data.usCitizen === true || data.usCitizen === 'true' || data.usCitizen === 'yes',
      driversLicense: data.driversLicense === true || data.driversLicense === 'true' || data.driversLicense === 'yes',
      ownCar: data.ownCar === true || data.ownCar === 'true' || data.ownCar === 'yes',
      speakSpanish: data.speakSpanish === true || data.speakSpanish === 'true' || data.speakSpanish === 'yes',
      otherLanguages: data.otherLanguages?.trim() || null,
      heardAbout: data.heardAbout?.trim() || "",
      emergencyContactName: data.emergencyContactName?.trim() || "",
      emergencyContactPhone: data.emergencyContactPhone?.trim() || "",
      professionalRefName: data.professionalRefName?.trim() || "",
      professionalRefPhone: data.professionalRefPhone?.trim() || "",
      personalRefName: data.personalRefName?.trim() || "",
      personalRefPhone: data.personalRefPhone?.trim() || "",
      educationLevel: data.educationLevel?.trim() || "",
      highSchoolName: data.highSchoolName?.trim() || null,
      collegeName: data.collegeName?.trim() || null,
      degreeObtained: data.degreeObtained?.trim() || null,
      additionalInfo1: data.additionalInfo1?.trim() || null,
      additionalInfo2: data.additionalInfo2?.trim() || null,
      arrestedOrConvicted: data.arrestedOrConvicted === true || data.arrestedOrConvicted === 'true' || data.arrestedOrConvicted === 'yes',
      convictionExplanation: data.convictionExplanation?.trim() || null,
      agreedToTerms: data.agreedToTerms === true || data.agreedToTerms === 'true' || data.agreedToTerms === 'yes',
      eSignature: data.eSignature?.trim() || "",
    };

    console.log("Processed data:", JSON.stringify(applicationData, null, 2));

    const application = await prisma.volunteerApplication.create({
      data: applicationData,
    });

    return NextResponse.json({ message: "Application submitted successfully", id: application.id }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error submitting application:", errorMessage);
    console.error("Full error:", error);
    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
    }
    
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: errorMessage,
        message: "Failed to submit application. Please check required fields and try again."
      }, 
      { status: 500 }
    );
  }
}
