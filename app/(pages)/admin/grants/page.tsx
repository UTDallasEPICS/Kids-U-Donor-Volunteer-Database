"use client";
import React, { useState, useEffect } from "react";
import type { Grant } from "@/prisma";
import Link from "next/link";
import Loading from "@/app/loading";

const headCells = [
  { id: "grantor", label: "Grantor" },
  //{ id: "representative", label: "Representative" },
  //{ id: "name", label: "Name" },
  { id: "status", label: "Status" },
  { id: "purpose", label: "Purpose" },
  { id: "startDate", label: "Start Date" },
  { id: "endDate", label: "End Date" },
  { id: "amountAwarded", label: "Amount Awarded" },
];

export default function GrantsPage() {
  const [grantsData, setGrantsData] = useState<Grant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchGrantsData = async () => {
    try {
      const response = await fetch(`/api/admin/grants/get`);
      const result = await response.json();
      setGrantsData(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching grants:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to load grants");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrantsData();
  }, []);

  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Grants</span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Grants List</span>
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
          <h2 className="text-2xl font-bold text-[#2f4b7c]">Grants</h2>
          <Link
            href="/admin/grants/add"
            className="bg-[#2f4b7c] hover:bg-[#4a6fa5] text-white font-semibold py-2.5 px-5 rounded-xl"
          >
            Add New Grant
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
              {grantsData?.map((grant) => (
                <tr key={grant.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 border-b max-w-xs text-sm text-[#2f4b7c] font-semibold">
                    <Link
                      className="text-[#2f4b7c] block truncate" 
                      href={`/admin/grants/detail/${grant.id}`}
                      title = {grant.name}
                    >
                      {grant.name}
                    </Link>
                  </td>
                  {/*<td className="px-6 py-4 border-b text-sm text-gray-700">
                    {grant.representativeGrant?.[0]?.representative?.grantor?.organization?.name ? (
                      <Link
                        className="text-[#2f4b7c]"
                        href={`/admin/grants/grantor/detail/${grant.representativeGrant[0].representative.grantorId}`}
                      >
                        {grant.representativeGrant[0].representative.grantor.organization.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>*/}
                  {/*<td className="px-6 py-4 border-b text-sm text-gray-700">
                    {grant.representativeGrant?.[0]?.representative?.person?.firstName &&
                    grant.representativeGrant?.[0]?.representative?.person?.lastName
                      ? `${grant.representativeGrant[0].representative.person.firstName} ${grant.representativeGrant[0].representative.person.lastName}`
                      : "—"}
                  </td>*/}
                  
                  <td className="px-6 py-4 border-b text-sm text-gray-700">{grant.status}</td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">{grant.purpose}</td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    {grant.startDate ? new Date(grant.startDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    {grant.endDate ? new Date(grant.endDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">${grant.amountAwarded}</td>
                </tr>
              )) ?? null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
