import prisma from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();

  try {
    const newGrant = await prisma.grant.create({
      data: {
        name: body.name,
        status: body.status,
        amountRequested: body.amountRequested,
        amountAwarded: body.amountAwarded,
        purpose: body.purpose,
        startDate: body.startDate,
        endDate: body.endDate,
        isMultipleYears: body.isMultipleYears,
        quarter: body.quarter,
        acknowledgementSent: body.acknowledgementSent,
        awardNotificationDate: body.awardNotificationDate,
        fundingArea: body.fundingArea,
        proposalDueDate: body.proposalDueDate,
        proposalSummary: body.proposalSummary,
        proposalSubmissionDate: body.proposalSubmissionDate,
        applicationType: body.applicationType,
        internalOwner: body.internalOwner,
        fundingRestriction: body.fundingRestriction,
        matchingRequirement: body.matchingRequirement,
        useArea: body.useArea,
        isEligibleForRenewal: body.isEligibleForRenewal,
        renewalApplicationDate: body.renewalApplicationDate,
        renewalAwardStatus: body.renewalAwardStatus,
      },
    });

    return NextResponse.json({ message: "POST REQUEST", grant: newGrant }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating grants", error: error }, { status: 500 });
  }
}

/*export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, description, amount } = req.body;

    try {
      const newGrant = await prisma.grant.create({
        data: {
          title,
          description,
          amount: parseFloat(amount), // Assuming amount is a number
        },
      });

      res.status(200).json(newGrant);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create grant' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
*/
