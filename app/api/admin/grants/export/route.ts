import { NextResponse } from "next/server";
import prisma from "@/app/utils/db";
import * as xlsx from 'xlsx';

function formatCurrency(n: number | null | undefined) {
  if (n === null || n === undefined) return "";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n));
  } catch {
    return String(n);
  }
}

function fmtDate(d?: Date | null) {
  return d ? new Date(d).toLocaleDateString("en-US") : "";
}

// Exact header layout from the example; first column is intentionally blank.
const BASE_HEADER = [
  "", // leading blank column
  "Assigned",
  "Quarter",
  "Funder",
  "Funding Area",
  "Kids-U Program ",
  "Contact Type",
  "LOI Due Date",
  "Grant Due Date",
  "Open-close dates",
  "Funding Restrictions",
  "Written Amount",
  "Amount Awarded ",
  "Notes",
  "Resources",
  "Link",
];

// Match the sheet’s width by padding with empty cells.
const TOTAL_COLUMNS = 28;

function padToWidth(arr: string[], width = TOTAL_COLUMNS) {
  const out = [...arr];
  while (out.length < width) out.push("");
  return out;
}

// Quarter labels (section rows)
const QUARTER_LABELS: Record<string, string> = {
  Q1: "Q1 Jan, Feb, Mar",
  Q2: "Q2 Apr, May, Jun",
  Q3: "Q3 Jul, Aug, Sep",
  Q4: "Q4 Oct, Nov, Dec",
};

const QUARTER_ORDER = ["Q1", "Q2", "Q3", "Q4"];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;

    // Optional filters
    const startDateParam = params.get("startDate");
    const endDateParam = params.get("endDate");
    const fund = params.get("fund");
    const minAmount = params.get("minAmount");
    const maxAmount = params.get("maxAmount");
    const status = params.get("status");
    const applicationType = params.get("applicationType");
    const grantorType = params.get("grantorType");

    const where: any = {};

    if (startDateParam || endDateParam) {
      where.startDate = {};
      if (startDateParam) where.startDate.gte = new Date(startDateParam);
      if (endDateParam) where.startDate.lte = new Date(endDateParam);
    }
    if (fund) {
      where.fundingArea = { contains: fund, mode: "insensitive" };
    }
    if (status) {
      where.status = { equals: status, mode: "insensitive" };
    }
    if (applicationType) {
      where.applicationType = { equals: applicationType, mode: "insensitive" };
    }
    if (minAmount || maxAmount) {
      where.amountAwarded = {};
      if (minAmount) where.amountAwarded.gte = Number(minAmount);
      if (maxAmount) where.amountAwarded.lte = Number(maxAmount);
    }
    if (grantorType) {
      // Keep filter on the relation path that leads to the funder
      where.representativeGrant = {
        some: {
          representative: {
            grantor: {
              type: grantorType,
            },
          },
        },
      };
    }

    // 1) Fetch grants
    const grants = await prisma.grant.findMany({
      where,
      select: {
        id: true,
        name: true,
        quarter: true,
        internalOwner: true,
        fundingArea: true,
        useArea: true,
        applicationType: true,
        proposalDueDate: true,
        fundingRestriction: true,
        amountRequested: true,
        amountAwarded: true,
        startDate: true,
      },
      orderBy: [{ quarter: "asc" }, { startDate: "desc" }],
    });

    // 2) Preload representatives/grantors/organizations for all returned grants
    const grantIds = grants.map(g => g.id);
    const reps = await prisma.representativeGrant.findMany({
      where: { grantId: { in: grantIds } },
      select: {
        grantId: true,
        representative: {
          select: {
            grantor: {
              select: {
                websiteLink: true,
                organization: {
                  select: {
                    name: true,
                    emailAddress: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // 3) Build lookup map with robust fallbacks
    const byGrant = new Map<
      string,
      {
        funderName: string;
        orgEmail: string;
        websiteLink: string;
      }
    >();

    for (const gId of grantIds) {
      const related = reps.filter(r => r.grantId === gId);
      const funderName =
        related.map(r => r.representative?.grantor?.organization?.name?.trim()).find(Boolean) ?? "";
      const orgEmail =
        related.map(r => r.representative?.grantor?.organization?.emailAddress?.trim()).find(Boolean) ?? "";
      const websiteLink =
        related.map(r => r.representative?.grantor?.websiteLink?.trim()).find(Boolean) ?? "";

      byGrant.set(gId, { funderName, orgEmail, websiteLink });
    }

    // 4) Group by quarter to emit section rows
    const grouped = new Map<string, typeof grants>();
    for (const g of grants) {
      const q = (g.quarter || "").toUpperCase();
      const key = QUARTER_ORDER.includes(q) ? q : "OTHER";
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(g);
    }

    // 5) Build rows as array-of-arrays (AOA) for XLSX
    const header = BASE_HEADER;
    const aoa: any[] = [];
    aoa.push(padToWidth(header));

    // 6) Rows grouped by quarter
    const order = [...QUARTER_ORDER, "OTHER"];
    for (const q of order) {
      const list = grouped.get(q);
      if (!list || list.length === 0) continue;

      const label = QUARTER_LABELS[q] || q;
      aoa.push(padToWidth(["", label]));

      for (const g of list) {
        const info = byGrant.get(g.id);
        let funder = (info?.funderName ?? "").trim();
        const orgEmail = info?.orgEmail ?? "";
        const websiteLink = info?.websiteLink ?? "";

        // Fallback: if no representative/org found, try to infer funder from the grant name
        if (!funder) {
          try {
            const namePart = (g.name ?? "").toString().split("|")[0]?.trim();
            funder = namePart || (g.name ?? "");
          } catch (e) {
            funder = g.name ?? "";
          }
        }

        const notes = "";
        const resources = "";

        const baseRow = [
          "",
          g.internalOwner ?? "",
          (g.quarter || "").toUpperCase(),
          funder,
          g.fundingArea ?? "",
          g.useArea ?? "",
          g.applicationType || orgEmail || "",
          "",
          fmtDate(g.proposalDueDate),
          "",
          g.fundingRestriction ?? "",
          formatCurrency(g.amountRequested),
          formatCurrency(g.amountAwarded),
          notes,
          resources,
          websiteLink,
        ];

        aoa.push(padToWidth(baseRow));
      }
    }

    const worksheet = xlsx.utils.aoa_to_sheet(aoa);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Grants');

    const wbOut = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    const filename = 'Example-Excel-Sheets-Grants-and-Donors.xlsx';

    const uint8 = typeof wbOut === 'object' && 'buffer' in wbOut ? wbOut : new Uint8Array(wbOut);
    return new NextResponse(uint8.buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Failed to export grants" }, { status: 500 });
  }
}
