// pages/api/data.js

// Example API endpoint
export default function handler(req, res) {
  // Here you can fetch data from a database, external API, etc.
  const data = { message: "Hello from API!" };

  // Return the data as JSON
  res.status(200).json(data);
}
