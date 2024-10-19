// donationController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createDonation = async (data) => {
  try {
    const newDonation = await prisma.donation.create({
      data: {
        DonationName: data.firstName + data.lastName,
        Years: data.donationDate,
        Category: category,
        Donation: donation,
        MethodValue: methodValue,
        Campaign: campaign,
        DonationDate: donationDate,
      },
    });
    return newDonation;
  } catch (error) {
    throw new Error(`Unable to create donation: ${error}`);
  }
};

module.exports = {
  createDonation,
};
