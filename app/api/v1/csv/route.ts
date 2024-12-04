import { NextResponse, NextRequest } from "next/server";
import { parse } from "csv-parse/sync"; // Note the change to sync version

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("csv") as File; // Note the change to "csv"

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileContent = await file.text();

    const records = parse(fileContent, {
      delimiter: ":",
      relax_quotes: true,
      relax_column_count: true,
    });

    console.log("Parsed CSV data:", records);

    return NextResponse.json({ message: "CSV parsed successfully", records });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
