// Import necessary modules
const { PrismaClient } = require('@prisma/client');

// Instantiate Prisma client
const prisma = new PrismaClient();

// Define your get function

export async function GET(Request: Request): Promise<Response> {
  try {
    //console.log(req);
    // Retrieve data from the database
    const data = await prisma.Grant.findMany(); 
    // Send the retrieved data as a response

    return Response.json(data);
  } catch (error) {
    // Handle errors
    console.error('Error fetching data:', error);
    return Response.json({ error: 'Internal Server Error' });
  }

}

