const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;
    const { WebsiteForFunder, StreetAddress, City, State, Zipcode, Country, OrganizationName, PortalForGrantApplication, NotesAboutLoginInfo } = req.body;
    
    try {
      const updatedOrganization = await prisma.organization.update({
        where: {
          OrganizationID: id,
        },
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
      res.status(200).json(updatedOrganization);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating organization' });
    }
  }