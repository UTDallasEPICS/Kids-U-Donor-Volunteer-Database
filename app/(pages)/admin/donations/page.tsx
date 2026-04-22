"use client";
import React, { useState, useEffect } from "react";
import type { Donation } from "@/prisma";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

const headCells = [
  { id: "donorType", numeric: false, label: "Donor Type" },
  { id: "donor", numeric: false, label: "Donor" },
  { id: "amount", numeric: true, label: "Amount" },
  { id: "date", numeric: false, label: "Date" },
  { id: "campaign", numeric: false, label: "Campaign" },
  { id: "paymentMethod", numeric: false, label: "Method" },
  { id: "type", numeric: false, label: "Type" },
];

export default function DonationsList() {
  const [data, setData] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  const fetchDonationsData = async () => {
    try {
      const response = await fetch("/api/admin/donations", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || "Something went wrong";
        throw new Error(message);
      }

      const result = await response.json();
      setData(result.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching:", error);
      router.push("/not-found");
    }
  };

  useEffect(() => {
    fetchDonationsData();
  }, []);

  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Donors</span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Donations</span>
    </div>
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex font-sans">
      <div className="flex-grow p-5">
        <Breadcrumb />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Donations</h2>
          <Link
            href="/admin/donations/add"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Donation
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                {headCells.map((headCell) => (
                  <th
                    key={headCell.id}
                    className="px-6 py-3 border-b text-left font-bold"
                  >
                    {headCell.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((donation) => {
                const donorName = donation?.donor?.person
                  ? `${donation.donor.person.firstName} ${donation.donor.person.lastName}`
                  : donation?.donor?.organization?.name || "—";
                const amount =
                  typeof donation.amount === "number"
                    ? donation.amount
                    : Number(donation.amount ?? 0);
                const donorType = donation?.donor?.type || "";
                return (
                  <tr key={donation.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 border-b">
                      <Link
                        className="text-blue-500"
                        href={`/admin/donations/detail/${donation.id}`}
                      >
                        {donorType}
                      </Link>
                    </td>
                    <td className="px-6 py-4 border-b">{donorName}</td>
                    <td className="px-6 py-4 border-b">
                      ${amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {new Date(donation.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {donation.campaign || ""}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {donation.type !== "In-Kind"
                        ? donation.paymentMethod || ""
                        : ""}
                    </td>
                    <td className="px-6 py-4 border-b">{donation.type}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  box: {
    marginLeft: "1em",
    marginRight: "1em",
    marginTop: "5em",
  },
  table: {
    minWidth: 750,
    borderLeft: "1px solid #ccc",
    borderRight: "1px solid #ccc",
    borderTop: "1px solid #ccc",
  },
  tableCellHeader: {
    fontWeight: "bold",
  },
  tableCell: {
    borderTop: "1px solid #ccc",
  },
};
