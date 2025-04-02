import { NextResponse, NextRequest } from "next/server";
import { parse } from "csv-parse/sync";

type RecordType = {
  [key: string]: string | number | null;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("csv") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileContent = await file.text();

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    });

    // Remvoe trailing white spaces in every cell
    const normalizedRecords = records.map((record: Record<string, any>) => {
      const normalizedRecord: Record<string, any> = {};

      for (const key in record) {
        const trimmedKey = key.trim();
        const value = record[key];

        normalizedRecord[trimmedKey] = typeof value === "string" ? value.trim() : value;
      }

      return normalizedRecord;
    });

    const funds = normalizedRecords.map((record: RecordType) => record["Kids-U Program"]).filter(Boolean);
    console.log("Fund:", funds);

    return NextResponse.json({ message: "CSV parsed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
