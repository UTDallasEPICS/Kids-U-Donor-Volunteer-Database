const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;
    
    try {
      await prisma.organization.delete({
        where: {
          OrganizationID: id,
        },
      });
      res.status(200).json({ message: 'Organization deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting organization' });
    }
  }