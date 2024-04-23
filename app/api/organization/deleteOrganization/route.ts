// Import necessary modules
const { PrismaClient } = require('@prisma/client');
const { URL } = require('url');

// Instantiate Prisma client
const prisma = new PrismaClient();

// Define your get function

export async function GET(Request: Request): Promise<Response> {
  try {
    // Extract the ID from the request parameters

    const url = new URL(Request.url);
    console.log(url);
    const id = url.searchParams.get('id');
    console.log(id);


    // Retrieve data from the database
    const organization = await prisma.Organization.delete({
      where: {
        // Specify the condition to find the grant (e.g., by ID)
        OrganizationID: id
      }
    });
    console.log(organization);

    // Send the retrieved data as a response
    return Response.json(organization);
  } catch (error) {
    // Handle errors
    console.error('Error fetching data:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}
