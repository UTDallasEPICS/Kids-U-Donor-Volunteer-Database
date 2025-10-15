import { NextResponse } from "next/server";
import prisma from "@/app/utils/db";

function escapeCsv(value: any) {
	if (value === null || value === undefined) return "";
	const s = String(value);
	if (s.includes(",") || s.includes("\n") || s.includes('"')) {
		return `"${s.replace(/"/g, '""')}"`;
	}
	return s;
}

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const params = url.searchParams;

		// Parse filters
		const startDateParam = params.get("startDate");
		const endDateParam = params.get("endDate");
		const donorType = params.get("donorType"); // e.g. 'Individual' or 'Organization'
		const fund = params.get("fund");
		const minAmount = params.get("minAmount");
		const maxAmount = params.get("maxAmount");

		const where: any = {};

		if (startDateParam || endDateParam) {
			where.date = {};
			if (startDateParam) where.date.gte = new Date(startDateParam);
			if (endDateParam) where.date.lte = new Date(endDateParam);
		}

		if (fund) {
			where.fundDesignation = { contains: fund, mode: "insensitive" };
		}

		if (minAmount || maxAmount) {
			where.amount = {};
			if (minAmount) where.amount.gte = Number(minAmount);
			if (maxAmount) where.amount.lte = Number(maxAmount);
		}

		if (donorType) {
			// filter by related donor.type
			where.donor = { some: { type: donorType } };
		}

		const donations = await prisma.donation.findMany({
			where,
			include: {
				donor: {
					include: {
						person: { include: { address: true } },        // load person.address
						organization: { include: { address: true } },
					},
				},
			},
			orderBy: { date: "desc" },
		});

		const headers = [
			"Donation ID",
			"Donor Type",
			"Donor First Name",
			"Donor Last Name",
			"Email Address",
			"Contact Number",
			"Address",
			"Preferred Contact Method",
			"Company Name (if applicable)",
			"Donation Amount",
			"Donation Method",
			"Donation Date",
			"Campaign/Event Name",
			"Donation Frequency",
			"Thank you/Follow Up Sent?"
		];

		const rows = [headers.join(",")];

		for (const d of donations) {
			const donor = d.donor;
			const person = donor?.person ?? null;
			const org = donor?.organization ?? null;

			// prefer person's address, fall back to org address, else empty
			const addressLine1 =
				person?.address?.addressLine1 ??
				org?.address?.addressLine1 ??
				"";

			const row = [
				escapeCsv(d.id),
				escapeCsv(donor?.type ?? ""),
				escapeCsv(person?.firstName ?? ""),
				escapeCsv(person?.lastName ?? ""),
				escapeCsv((person?.emailAddress ?? "") || (org?.emailAddress ?? "")),
				escapeCsv(person?.phoneNumber ?? ""),
				escapeCsv(addressLine1),
				escapeCsv(donor?.communicationPreference ?? ""),
				escapeCsv(org?.name ?? ""),
				escapeCsv(d.amount),
				escapeCsv(d.paymentMethod ?? ""),
				escapeCsv(d.date?.toLocaleDateString() ?? ""),
				escapeCsv(d.campaign ?? ""),
				escapeCsv(d.recurringFrequency ?? ""),
				escapeCsv(d.acknowledgementSent ? "Yes" : "No")
			];

			rows.push(row.join(","));
		}

		const csv = rows.join("\n");

		return new NextResponse(csv, {
			status: 200,
			headers: {
				"Content-Type": "text/csv; charset=utf-8",
				"Content-Disposition": `attachment; filename="donations_export.csv"`,
			},
		});
	} catch (err) {
		console.error("Export error:", err);
		return NextResponse.json({ error: "Failed to export donations" }, { status: 500 });
	}
}

