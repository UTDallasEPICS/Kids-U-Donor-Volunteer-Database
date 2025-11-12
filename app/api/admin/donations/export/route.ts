import { NextResponse } from "next/server";
import prisma from "@/app/utils/db";
import * as xlsx from 'xlsx';

function fmtDate(d?: Date | null) {
	if (!d) return "";
	try {
		return new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(new Date(d));
	} catch {
		return "";
	}
}

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const params = url.searchParams;

		// Parse filters
	const startDateParam = params.get("startDate");
	const endDateParam = params.get("endDate");
	const donorType = params.get("donorType"); // e.g. 'Individual' or 'Organization'
	const donorStatus = params.get("donorStatus");
	const commPref = params.get("commPref");
	const fund = params.get("fund");
	const minAmount = params.get("minAmount");
	const maxAmount = params.get("maxAmount");
	const paymentMethod = params.get("paymentMethod");
	const campaign = params.get("campaign");
	const acknowledgementSent = params.get("acknowledgementSent"); // 'true' | 'false'
	const recurringFrequency = params.get("recurringFrequency");

		const where: any = {};

		if (startDateParam || endDateParam) {
			const range: any = {};
			if (startDateParam) range.gte = new Date(`${startDateParam}T00:00:00.000Z`);
			if (endDateParam) range.lte = new Date(`${endDateParam}T23:59:59.999Z`);
			where.date = range;
		}

		if (fund) {
			where.fundDesignation = { contains: fund, mode: "insensitive" };
		}

		if (minAmount || maxAmount) {
			where.amount = {};
			if (minAmount) where.amount.gte = Number(minAmount);
			if (maxAmount) where.amount.lte = Number(maxAmount);
		}

		// Donation-level filters
		if (paymentMethod) where.paymentMethod = { equals: paymentMethod, mode: "insensitive" };
		if (campaign) where.campaign = { contains: campaign, mode: "insensitive" };
		if (acknowledgementSent === 'true' || acknowledgementSent === 'false') {
			where.acknowledgementSent = acknowledgementSent === 'true';
		}
		if (recurringFrequency) where.recurringFrequency = { equals: recurringFrequency, mode: "insensitive" };

		// Donor-level composite filters
		const donorWhere: any = {};
		if (donorType) donorWhere.type = donorType;
		if (donorStatus) donorWhere.status = { equals: donorStatus, mode: "insensitive" };
		if (commPref) donorWhere.communicationPreference = { equals: commPref, mode: "insensitive" };
		if (Object.keys(donorWhere).length) {
			where.donor = { is: donorWhere };
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

		const rows: any[] = [];
		rows.push(headers);

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
				d.id,
				donor?.type ?? "",
				person?.firstName ?? "",
				person?.lastName ?? "",
				(person?.emailAddress ?? "") || (org?.emailAddress ?? ""),
				person?.phoneNumber ?? "",
				addressLine1,
				donor?.communicationPreference ?? "",
				org?.name ?? "",
				d.amount,
				d.paymentMethod ?? "",
				fmtDate(d.date),
				d.campaign ?? "",
				d.recurringFrequency ?? "",
				d.acknowledgementSent ? "Yes" : "No",
			];

			rows.push(row);
		}

		// Create worksheet and workbook using xlsx
		const worksheet = xlsx.utils.aoa_to_sheet(rows);
		const workbook = xlsx.utils.book_new();
		xlsx.utils.book_append_sheet(workbook, worksheet, 'Donations');

		const wbOpts: xlsx.WritingOptions = { bookType: 'xlsx', type: 'array' };
		const wbOut: any = xlsx.write(workbook, wbOpts); // ArrayBuffer-like (Uint8Array)

		const filename = 'donations_export.xlsx';

		// wbOut is an ArrayBuffer-like (Uint8Array); ensure we return an ArrayBuffer
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
		return NextResponse.json({ error: "Failed to export donations" }, { status: 500 });
	}
}

