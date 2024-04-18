// pages/api/organizations/create.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { WebsiteForFunder, StreetAddress, City, State, Zipcode, Country, OrganizationName, PortalForGrantApplication, NotesAboutLoginInfo } = req.body;
  
  try {
    const organization = await prisma.organization.create({
      data: {
        WebsiteForFunder,
        StreetAddress,
        City,
        State,
        Zipcode,
        Country,
        OrganizationName,
        PortalForGrantApplication,
        NotesAboutLoginInfo,
      },
    });
    res.status(201).json(organization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating organization' });
  }
}
