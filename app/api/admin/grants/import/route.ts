import { NextResponse, NextRequest } from "next/server";
import { parse } from "csv-parse/sync";
import prisma from "@/app/utils/db";

type Row = Record<string, any>;

function normalizeKey(k: string): string {
  return (k ?? "").trim();
}

function normalizeStr(v: any): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}


function parseDate(value: any): Date | null {
  const v = normalizeStr(value);
  if (!v) return null;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? null : d;
}

function parseBoolean(value: any): boolean {
  const v = normalizeStr(value);
  if (!v) return false;
  const str = v.toLowerCase();
  const truthy = new Set(["true", "yes", "1", "y"]);
  const falsy = new Set(["false", "no", "0", "n"]);
  if (truthy.has(str)) return true;
  if (falsy.has(str)) return false;
  return false;
}

function extractEmail(s: string | null): string | null {
  if (!s) return null;
  const m = s.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return m ? m[0] : null;
}

function extractUrls(s: string | null): string[] {
  if (!s) return [];
  const matches = s.match(/https?:\/\/\S+/gi) ?? [];
  return matches.map(u => u.replace(/[),.]+$/, ""));
}

function parseCurrencyOrRange(v: any): number {
  const raw = normalizeStr(v);
  if (!raw) return 0;

  // Remove common currency symbols and thousands separators, normalize dashes
  let s = String(raw).trim();
  // Handle parentheses for negatives: (1,000) -> -1000
  const parenMatch = s.match(/^\((.*)\)$/);
  const negativeByParens = !!parenMatch;
  if (negativeByParens && parenMatch) s = parenMatch[1];

  s = s.replace(/[$£€¥]/g, "");
  // remove commas used as thousands separators
  s = s.replace(/,/g, "");
  // normalize various dash types to hyphen
  s = s.replace(/[\u2012\u2013\u2014\u2212]/g, "-");
  s = s.trim().toLowerCase();

  const parseOne = (t: string): number => {
    if (!t) return NaN;
    let x = t.trim();
    // look for a number with optional decimal
    const m = /(-?\d+(?:\.\d+)?)/.exec(x);
    if (!m) return NaN;
    let num = parseFloat(m[1]);
    if (isNaN(num)) return NaN;
    // support k/m shorthand (e.g., 5k -> 5000, 2.5m -> 2500000)
    if (/k\b/.test(x)) num = num * 1000;
    if (/m\b/.test(x)) num = num * 1000000;
    return num;
  };

  // detect explicit range separators: ' to ' or ' - ' (with spaces) to avoid confusion with negative numbers
  const rangeMatch = s.match(/^(.*)\s+(?:to|-)\s+(.*)$/i);
  if (rangeMatch) {
    const a = parseOne(rangeMatch[1]);
    const b = parseOne(rangeMatch[2]);
    const parts = [a, b].filter(n => isFinite(n));
    if (parts.length === 2) {
      const avg = (parts[0] + parts[1]) / 2;
      return negativeByParens ? -Math.abs(avg) : avg;
    }
    if (parts.length === 1) return negativeByParens ? -Math.abs(parts[0]) : parts[0];
  }

  const val = parseOne(s);
  if (!isFinite(val)) return 0;
  return negativeByParens ? -Math.abs(val) : val;
}

function firstNonEmpty(row: Row, keys: string[]): string | null {
  for (const k of keys) {
    const v = row[k];
    const s = normalizeStr(v);
    if (s) return s;
  }
  return null;
}

function buildGrantName(args: {
  funder: string | null;
  kidsUProgram: string | null;
  fundingArea: string | null;
  quarter: string | null;
  dueDate: string | null;
  link: string | null;
}): string {
  const parts = [
    args.funder,
    args.kidsUProgram || args.fundingArea,
    args.quarter,
    args.dueDate,
    args.link,
  ].filter(Boolean) as string[];
  return parts.join(" | ").slice(0, 255) || "Unnamed Grant";
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 415 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("csv") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const fileContent = await file.text();

    const rawRecords = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
    }) as Row[];

    const records: Row[] = rawRecords.map((record) => {
      const out: Row = {};
      for (const key in record) {
        out[normalizeKey(key)] =
          typeof record[key] === "string" ? record[key].trim() : record[key];
      }
      return out;
    });

    const summary = {
      organizationsCreated: 0,
      grantorsCreated: 0,
      grantsCreated: 0,
      grantsUpdated: 0,
      attachmentsCreated: 0,
      skippedRows: 0,
      errors: [] as string[],
    };

    for (let idx = 0; idx < records.length; idx++) {
      const row = records[idx];

      try {
        // Exact columns from the provided CSV
        const assigned = firstNonEmpty(row, ["Assigned"]);
        const quarter = firstNonEmpty(row, ["Quarter"]);
        const funder = firstNonEmpty(row, ["Funder"]);
        const fundingArea = firstNonEmpty(row, ["Funding Area"]);
        const kidsUProgram = firstNonEmpty(row, ["Kids-U Program", "Kids-U Program "]);
        const contactType = firstNonEmpty(row, ["Contact Type"]);
        const loiDue = firstNonEmpty(row, ["LOI Due Date"]);
        const grantDue = firstNonEmpty(row, ["Grant Due Date"]);
        const openClose = firstNonEmpty(row, ["Open-close dates"]);
        const fundingRestrictions = firstNonEmpty(row, ["Funding Restrictions"]);
        const writtenAmount = firstNonEmpty(row, ["Written Amount"]);
        const amountAwardedRaw = firstNonEmpty(row, ["Amount Awarded", "Amount Awarded "]);
        const link = firstNonEmpty(row, ["Link"]);

        const corePresent =
          funder || grantDue || loiDue || writtenAmount || amountAwardedRaw || link;
        const isQuarterBanner =
          (quarter && /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(quarter)) && !funder;
        if (!corePresent || isQuarterBanner) {
          summary.skippedRows += 1;
          continue;
        }

        const orgName = funder ?? "Unknown Grantor";
        let organization = await prisma.organization.findFirst({
          where: { name: orgName },
        });

        const contactEmail = extractEmail(contactType ?? "");
        if (!organization && contactEmail) {
          organization = await prisma.organization.findUnique({
            where: { emailAddress: contactEmail },
          }).catch(() => null as any);
        }
        if (!organization) {
          try {
            organization = await prisma.organization.create({
              data: { name: orgName, emailAddress: contactEmail },
            });
            summary.organizationsCreated += 1;
          } catch {
            organization =
              (await prisma.organization.findFirst({ where: { name: orgName } })) ??
              (await prisma.organization.create({
                data: { name: `${orgName} (dup)` },
              }));
            summary.organizationsCreated += 1;
          }
        }

        let grantor = await prisma.grantor.findUnique({
          where: { organizationId: organization.id },
        });
        if (!grantor) {
          grantor = await prisma.grantor.create({
            data: {
              type: "Foundation",
              websiteLink: null,
              communicationPreference:
                (contactEmail ? "Email" : normalizeStr(contactType) ?? "Unknown"),
              recognitionPreference: "None",
              internalRelationshipManager: "Unassigned",
              organizationId: organization.id,
              status: true,
            },
          });
          summary.grantorsCreated += 1;
        }

        const internalOwner =
          assigned && assigned.toLowerCase() !== "not written" ? assigned : null;
        const status =
          assigned && assigned.toLowerCase() === "not written" ? "Not written" : "Planned";

        const amountRequested = parseCurrencyOrRange(writtenAmount);
        const amountAwarded = parseCurrencyOrRange(amountAwardedRaw);

        const internalProposalDueDate = parseDate(loiDue);
        const proposalDueDate = parseDate(grantDue);

        const grantName = buildGrantName({
          funder: orgName,
          kidsUProgram,
          fundingArea,
          quarter: quarter ?? null,
          dueDate: grantDue ?? loiDue ?? null,
          link: link ?? null,
        });

        // Proposal summary now excludes Notes and Resources (left blank)
        const summaryPieces: string[] = [];
        if (openClose) summaryPieces.push(`Open-close: ${openClose}`);
        const proposalSummary =
          summaryPieces.length ? summaryPieces.join(" | ").slice(0, 2000) : null;

        const grantData = {
          name: grantName,
          status,
          amountRequested,
          amountAwarded,
          purpose: "General",
          startDate: new Date(),
          endDate: new Date(),
          isMultipleYears: false,
          quarter: quarter ?? "Unknown",
          acknowledgementSent: false,
          awardNotificationDate: null,
          fundingArea: fundingArea ?? "Not specified",
          internalProposalDueDate: internalProposalDueDate ?? null,
          proposalDueDate: proposalDueDate ?? new Date(),
          proposalSummary,
          proposalSubmissionDate: null,
          applicationType:
            contactEmail ? "Email" : (normalizeStr(contactType) ?? "Not specified"),
          internalOwner: internalOwner ?? "Unassigned",
          fundingRestriction: fundingRestrictions ?? null,
          matchingRequirement: null,
          useArea: kidsUProgram ?? "Not specified",
          isEligibleForRenewal: false,
          renewalApplicationDate: null,
          renewalAwardStatus: null,
        };

        const existingGrant = await prisma.grant.findUnique({
          where: { name: grantName },
        });

        let grant;
        if (!existingGrant) {
          grant = await prisma.grant.create({ data: grantData });
          summary.grantsCreated += 1;
        } else {
          grant = await prisma.grant.update({
            where: { id: existingGrant.id },
            data: grantData,
          });
          summary.grantsUpdated += 1;
        }

        // Attachments only from Link now (Notes/Resources are ignored)
        const urls = new Set<string>();
        extractUrls(link).forEach((u) => urls.add(u));
        // Intentionally do NOT add URLs from Notes or Resources

        if (urls.size) {
          const toCreate = Array.from(urls).map((u) => ({
            grantId: grant.id,
            document: u,
          }));
          const res = await prisma.grantAttachment.createMany({
            data: toCreate,
            skipDuplicates: true,
          });
          summary.attachmentsCreated += res.count;
        }
      } catch (recErr: any) {
        console.error(`Row ${idx} import error`, recErr);
        summary.errors.push(`Row ${idx}: ${String(recErr?.message ?? recErr)}`);
      }
    }

    return NextResponse.json(
      { message: "CSV parsed and imported (grants)", summary, totalRowsProcessed: records.length },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
