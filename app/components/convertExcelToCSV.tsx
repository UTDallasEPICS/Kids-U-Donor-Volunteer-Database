"use client";
import * as XLSX from 'xlsx';

// Convert an uploaded Excel File (from the browser) into CSV text.
// Returns CSV string of the first worksheet.
export default async function convertExcelToCSV(file: File): Promise<string> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  if (!workbook.SheetNames.length) {
    throw new Error('No sheets found in the uploaded Excel file.');
  }

  const firstSheetName = workbook.SheetNames[0];
  const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheetName]);
  if (!csv || csv.trim().length === 0) {
    throw new Error('The worksheet is empty or could not be converted to CSV.');
  }
  return csv;
}