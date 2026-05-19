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
  const [errorMessage, setErrorMessage] = useState<string>("");

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
      setErrorMessage(error instanceof Error ? error.message : "Failed to load donations");
      setIsLoading(false);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb />

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold text-[#2f4b7c]">Donations</h2>
          <Link
            href="/admin/donations/add"
            className="bg-[#2f4b7c] hover:bg-[#4a6fa5] text-white font-semibold py-2.5 px-5 rounded-xl"
          >
            Add New Donation
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                {headCells.map((headCell) => (
                  <th
                    key={headCell.id}
                    className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700"
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
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b text-sm text-[#2f4b7c] font-semibold">
                      <Link
                        className="text-[#2f4b7c]"
                        href={`/admin/donations/detail/${donation.id}`}
                      >
                        {donorType}
                      </Link>
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-700">{donorName}</td>
                    <td className="px-6 py-4 border-b text-sm text-gray-700">
                      ${amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-700">
                      {new Date(donation.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-700">
                      {donation.campaign || ""}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-700">
                      {donation.type !== "In-Kind"
                        ? donation.paymentMethod || ""
                        : ""}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-700">{donation.type}</td>
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
