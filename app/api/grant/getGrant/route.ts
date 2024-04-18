// Import necessary modules
const { PrismaClient } = require('@prisma/client');
const { URL } = require('url');

// Instantiate Prisma client
const prisma = new PrismaClient();

// Define your get function

export async function GET(Request: Request): Promise<Response> {
  try {

    const url = new URL(Request.url);
    const id = url.searchParams.get('id');
    
    // Retrieve data from the database
    const data = await prisma.Grant.findFirst({where: {GrantId: id}}); // Replace 'yourModelName' with the name of your Prisma model
    console.log(data);
    // Send the retrieved data as a response

    return Response.json(data);
  } catch (error) {
    // Handle errors
    console.error('Error fetching data:', error);
    return Response.json({ error: 'Internal Server Error' });
  }

}

