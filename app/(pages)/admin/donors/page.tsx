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

  const router = useRouter();

  const fetchDonorData = async () => {
    try {
      const response = await fetch("/api/admin/donors", {
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
    <div className="flex font-sans">
      <div className="flex-grow p-5">
        <Breadcrumb />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Donors</h2>
          <Link
            href="/admin/donors/add"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Donor
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
                  <tr key={donor.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 border-b">
                      <Link
                        className="text-blue-500"
                        href={`/admin/donors/detail/${donor.id}`}
                      >
                        {donor.type}
                      </Link>
                    </td>
                    <td className="px-6 py-4 border-b">{name}</td>
                    <td className="px-6 py-4 border-b">{email}</td>
                    <td className="px-6 py-4 border-b">{phone}</td>
                    <td className="px-6 py-4 border-b">${total.toFixed(2)}</td>
                    <td className="px-6 py-4 border-b">{last}</td>
                    <td className="px-6 py-4 border-b">{donor.status}</td>
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
