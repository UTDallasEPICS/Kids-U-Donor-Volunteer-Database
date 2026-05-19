"use client";
import React, { useState, useEffect } from "react";
import { Grantor } from "@/prisma";
import Link from "next/link";
import Loading from "@/app/loading";

const headCells = [
  { id: "name", label: "Name" },
  { id: "type", label: "Type" },
  { id: "addressLine1", label: "Address Line 1" },
  { id: "city", label: "City" },
  { id: "state", label: "State" },
  { id: "zipcode", label: "Zipcode" },
  { id: "communicationPreference", label: "Communication Preference" },
];

export default function GrantorsPage() {
  const [grantorsData, setGrantorsData] = useState<Grantor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchGrantorsData = async () => {
    try {
      const response = await fetch(`/api/admin/grantors/get`);
      const result = await response.json();
      setGrantorsData(result.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching grantors:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to load grantors");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrantorsData();
  }, []);

  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Grants</span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Grantors</span>
    </div>
  );

  if (loading) {
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
          <h2 className="text-2xl font-bold text-[#2f4b7c]">Grantors</h2>
          <Link
            href="/admin/grants/grantor/add"
            className="bg-[#2f4b7c] hover:bg-[#4a6fa5] text-white font-semibold py-2.5 px-5 rounded-xl"
          >
            Add New Grantor
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
              {grantorsData?.map((grantor) => (
                <tr key={grantor.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 border-b text-sm text-[#2f4b7c] font-semibold">
                    <Link
                      className="text-[#2f4b7c]"
                      href={`/admin/grants/grantor/detail/${grantor.id}`}
                    >
                      {grantor.organization?.name || "—"}
                    </Link>
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">{grantor.type || "—"}</td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    {grantor.organization?.address?.addressLine1 || "—"}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    {grantor.organization?.address?.city || "—"}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    {grantor.organization?.address?.state || "—"}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    {grantor.organization?.address?.zipCode || "—"}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    {grantor.communicationPreference || "—"}
                  </td>
                </tr>
              )) ?? null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}