// pages/api/add-constituent.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { firstName, lastName, streetAddress, city, state, zipcode, country, emailAddress, phoneNumber, areaCode, companySchoolName } = req.body;

    const newConstituent = await prisma.constituent.create({
      data: {
        FirstName: firstName,
        LastName: lastName,
        StreetAddress: streetAddress,
        City: city,
        State: state,
        Zipcode: zipcode,
        Country: country,
        EmailAddress: emailAddress,
        PhoneNumber: phoneNumber,
        AreaCode: areaCode,
        CompanySchoolName: companySchoolName,
      },
    });

    res.status(201).json(newConstituent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
