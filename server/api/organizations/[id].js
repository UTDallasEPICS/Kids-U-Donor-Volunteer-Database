const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;
    
    try {
      const organization = await prisma.organization.findUnique({
        where: {
          OrganizationID: id,
        },
      });
      if (!organization) {
        res.status(404).json({ error: 'Organization not found' });
        return;
      }
      res.status(200).json(organization);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching organization' });
    }
  }