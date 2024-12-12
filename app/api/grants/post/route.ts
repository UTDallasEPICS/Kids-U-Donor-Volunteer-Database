import prisma from '../../../utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse){
    try {
      const newGrant = await prisma.grant.create({
        data: {
          name: name,
          status: status,
          amountRequested, 
          amountAwarded,
          purpose,
          startDate,
          endDate,
          isMultipleYears,
          quarter,
          acknowledgementSent,
          awardNotificationDate,
          fundingArea,
          proposalDueDate,
          proposalSummary,
          proposalSubmissionDate,
          applicationType,
          internalOwner,
          fundingRestriction,
          matchingRequirement, 
          useArea,
          isEligibleForRenewal,
          renewalApplicationDate,
          renewalAwardStatus,
        },
      });

      return NextResponse.json(
        { message: 'POST REQUEST', grant: newGrant},
        { status: 200 }
      );

    } catch (error) {
      return NextResponse.json(
        { message: 'Error creating grants', error: error },
        { status: 500 }
      );
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