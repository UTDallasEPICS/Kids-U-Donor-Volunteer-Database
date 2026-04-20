import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Use JWT email as the authoritative email so status lookups always match
    const userPayloadHeader = req.headers.get("x-user-payload");
    const jwtEmail = userPayloadHeader ? JSON.parse(userPayloadHeader).email : null;
    const email = jwtEmail ?? data.email;

    if (!data.legalName || !data.ssn || !data.phoneNumber || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const applicationData = {
      legalName: data.legalName,
      maidenName: data.maidenName || null,
      ssn: data.ssn,
      preferredName: data.preferredName || null,
      currentAddress: data.currentAddress,
      phoneNumber: data.phoneNumber,
      email: email,
      usCitizen: data.usCitizen || false,
      driversLicense: data.driversLicense || false,
      ownCar: data.ownCar || false,
      speakSpanish: data.speakSpanish || false,
      otherLanguages: data.otherLanguages || null,
      heardAbout: data.heardAbout || null,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      professionalRefName: data.professionalRefName,
      professionalRefPhone: data.professionalRefPhone,
      personalRefName: data.personalRefName,
      personalRefPhone: data.personalRefPhone,
      educationLevel: data.educationLevel,
      highSchoolName: data.highSchoolName || null,
      collegeName: data.collegeName || null,
      degreeObtained: data.degreeObtained || null,
      additionalInfo1: data.additionalInfo1 || null,
      additionalInfo2: data.additionalInfo2 || null,
      arrestedOrConvicted: data.arrestedOrConvicted || false,
      convictionExplanation: data.convictionExplanation || null,
      agreedToTerms: data.agreedToTerms || false,
      eSignature: data.eSignature,
      status: "PENDING" as const,
      softdelete: false,
    };

    // Find the most recent existing application for this email and upsert it
    const existing = await prisma.volunteerApplication.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    let application;
    if (existing) {
      application = await prisma.volunteerApplication.update({
        where: { id: existing.id },
        data: { ...applicationData, createdAt: new Date() },
      });
    } else {
      application = await prisma.volunteerApplication.create({
        data: applicationData,
      });
    }

    return NextResponse.json(
      { message: "Application submitted successfully", id: application.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
