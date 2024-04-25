// Import necessary modules
const { PrismaClient } = require('@prisma/client');
const { URL } = require('url');

// Instantiate Prisma client
const prisma = new PrismaClient();

// Define your update function
export async function PUT(Request: Request): Promise<Response> {
  try {
    // Extract the ID from the request parameters
    const url = new URL(Request.url);
    const id = url.searchParams.get('id');

    // Extract the updated data from the request body
    const requestBody = await Request.json();
    const updatedData = requestBody.updatedData; 
    console.log(updatedData);

    // Update the data in the database
    const updatedGrant = await prisma.Grant.update({
      where: {
        GrantID: id // Specify the condition to find the grant (e.g., by ID)
      },
      data: updatedData // Specify the updated data object
    });

    // Send the updated data as a response
    return Response.json(updatedGrant);
  } catch (error) {
    // Handle errors
    console.error('Error updating data:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}
