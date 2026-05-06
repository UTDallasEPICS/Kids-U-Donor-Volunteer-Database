"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { Donor as PrismaDonor } from "@prisma/client";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

const headCells = [
  { id: "type", numeric: false, label: "Donor Type" },
  { id: "name", numeric: false, label: "Name" },
  { id: "email", numeric: false, label: "Email" },
  { id: "phone", numeric: false, label: "Phone" },
  { id: "total", numeric: true, label: "Total Donated" },
  { id: "last", numeric: false, label: "Last Donation" },
  { id: "status", numeric: false, label: "Status" },
];

type DonorWithRelations = PrismaDonor & {
  person?: { firstName: string; lastName: string; emailAddress: string; phoneNumber: string | null } | null;
  organization?: { name: string; emailAddress: string | null } | null;
  donation?: Array<{ amount: number; date: string }>;
};

export default function DonorsList() {
  const [data, setData] = useState<DonorWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const fetchDonorData = async () => {
    try {
      const response = await fetch("/api/admin/donors", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401 || response.status === 403) {
          throw new Error("Not authorized. Please sign in again.");
        }
        const message = errorData?.message || errorData?.error || "Unable to load donors.";
        throw new Error(message);
      }

      const result = await response.json();
      setData(Array.isArray(result.data) ? result.data : []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to load donors");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorData();
  }, []);

  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Donors</span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Donors List</span>
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
          <h2 className="text-2xl font-bold text-[#2f4b7c]">Donors</h2>
          <Link
            href="/admin/donors/add"
            className="bg-[#2f4b7c] hover:bg-[#4a6fa5] text-white font-semibold py-2.5 px-5 rounded-xl"
          >
            Add New Donor
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
              {data.map((donor) => {
                const name = donor.person
                  ? `${donor.person.firstName} ${donor.person.lastName}`
                  : donor.organization?.name || "—";
                const email = donor.person?.emailAddress || donor.organization?.emailAddress || "";
                const phone = donor.person?.phoneNumber || "";
                const total = (donor.donation || []).reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
                const lastDateIso = donor.donation && donor.donation[0]?.date;
                const last = lastDateIso ? new Date(lastDateIso).toLocaleDateString() : "";

                return (
                  <tr key={donor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b text-sm text-[#2f4b7c] font-semibold">
                      <Link
                        className="text-[#2f4b7c]"
                        href={`/admin/donors/detail/${donor.id}`}
                      >
                        {donor.type}
                      </Link>
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-700">{name}</td>
                    <td className="px-6 py-4 border-b text-sm text-gray-700">{email}</td>
                    <td className="px-6 py-4 border-b text-sm text-gray-700">{phone}</td>
                    <td className="px-6 py-4 border-b text-sm text-gray-700">${total.toFixed(2)}</td>
                    <td className="px-6 py-4 border-b text-sm text-gray-700">{last}</td>
                    <td className="px-6 py-4 border-b text-sm text-gray-700">{donor.status}</td>
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
