// Simple test script to verify CSV import functionality
const fs = require('fs');
const FormData = require('form-data');

// Create a test CSV file
const testCSV = `Last Name,First Name,Just First Name,Full Name,Organization,Email,Phone,Address,City,State,Postal Code,Country,Supporter Id,Anonymous?,Total Contributed,Id,Last Payment Received,Notes,Tags
Smith,John,John Smith,,Test Company,john.smith@test.com,2145551234,123 Main St,Dallas,TX,75201,United States,12345,FALSE,$100.00 ,12345,2024-01-15 10:30:00 +0000,Test supporter,Test Tag
Doe,Jane,Jane Doe,,jane.doe@test.com,2145555678,456 Oak Ave,Plano,TX,75023,United States,67890,FALSE,$50.00 ,67890,2024-01-10 14:20:00 +0000,Another supporter,Another Tag`;

fs.writeFileSync('/tmp/test-supporters.csv', testCSV);
console.log('Test CSV file created at /tmp/test-supporters.csv');

// Test the API endpoint
async function testCSVImport() {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream('/tmp/test-supporters.csv'));

    const response = await fetch('http://localhost:3000/api/admin/donors/import-fixed', {
      method: 'POST',
      body: form,
    });

    const result = await response.json();
    console.log('Import result:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

console.log('Run testCSVImport() to test the import functionality');
