import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();

  const requiredFields = [
    "name",
    "status",
    "amountRequested",
    "amountAwarded",
    "purpose",
    "startDate",
    "endDate",
    "isMultipleYears",
    "quarter",
    "acknowledgementSent",
    "fundingArea",
    "proposalDueDate",
    "applicationType",
    "internalOwner",
    "useArea",
    "isEligibleForRenewal",
  ];

  const missingFields = requiredFields.filter((field) => !(field in body));

  if (missingFields.length > 0) {
    console.log("Missing fields:", missingFields);
    return NextResponse.json({ message: "Missing required fields", missingFields }, { status: 400 });
  }

  try {
    // Ensure proper Date object conversion for DateTime fields
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    const awardNotificationDate = body.awardNotificationDate ? new Date(body.awardNotificationDate) : null;
    const proposalDueDate = new Date(body.proposalDueDate);
    const proposalSubmissionDate = body.proposalSubmissionDate ? new Date(body.proposalSubmissionDate) : null;
    const renewalApplicationDate = body.renewalApplicationDate ? new Date(body.renewalApplicationDate) : null;

    const newGrant = await prisma.grant.create({
      data: {
        name: body.name,
        status: body.status,
        amountRequested: body.amountRequested,
        amountAwarded: body.amountAwarded,
        purpose: body.purpose,
        startDate: startDate,
        endDate: endDate,
        isMultipleYears: body.isMultipleYears,
        quarter: body.quarter,
        acknowledgementSent: body.acknowledgementSent,
        awardNotificationDate: awardNotificationDate,
        fundingArea: body.fundingArea,
        proposalDueDate: proposalDueDate,
        proposalSummary: body.proposalSummary || null,
        proposalSubmissionDate: proposalSubmissionDate,
        applicationType: body.applicationType,
        internalOwner: body.internalOwner,
        fundingRestriction: body.fundingRestriction || null,
        matchingRequirement: body.matchingRequirement || null,
        useArea: body.useArea,
        isEligibleForRenewal: body.isEligibleForRenewal,
        renewalApplicationDate: renewalApplicationDate,
        renewalAwardStatus: body.renewalAwardStatus || null,
      },
    });

    return NextResponse.json({ message: "POST REQUEST", grant: newGrant }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error creating grant:", errorMessage); // Log the detailed error message
    return NextResponse.json({ message: "Error creating grants", error: errorMessage }, { status: 500 });
  }
}
