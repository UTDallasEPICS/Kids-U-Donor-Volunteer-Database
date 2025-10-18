import * as xlsx from 'xlsx';
import * as fs from 'fs';

export function convertExcelToCsv (excelFilePath: string): String | void {
  try {
    // Read the Excel workbook
    const workbook = xlsx.readFile(excelFilePath);

    // Get the first sheet name
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet to CSV format
    const csvData = xlsx.utils.sheet_to_csv(worksheet);

    // Write the CSV data to a file
    fs.writeFileSync("./app/components/csv", csvData);

    console.log(`Successfully converted ${excelFilePath} to ./csv`);
  } catch (error) {
    console.error(`Error converting Excel to CSV: ${error}`);
  }
};