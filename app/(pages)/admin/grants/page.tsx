"use client";
import React, { useState, useEffect } from "react";
import type { Grant } from "@/prisma";
import Link from "next/link";
import Loading from "@/app/loading";

const headCells = [
  { id: "grantor", label: "Grantor" },
  { id: "representative", label: "Representative" },
  { id: "name", label: "Name" },
  { id: "status", label: "Status" },
  { id: "purpose", label: "Purpose" },
  { id: "startDate", label: "Start Date" },
  { id: "endDate", label: "End Date" },
  { id: "amountAwarded", label: "Amount Awarded" },
];

export default function GrantsPage() {
  const [grantsData, setGrantsData] = useState<Grant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGrantsData = async () => {
    try {
      const response = await fetch(`/api/admin/grants/get`);
      const result = await response.json();
      setGrantsData(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching grants:", error);
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
    <div className="flex font-sans">
      <div className="flex-grow p-5">
        <Breadcrumb />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Grants</h2>
          <Link
            href="/admin/grants/add"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Grant
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
              {grantsData?.map((grant) => (
                <tr key={grant.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 border-b max-w-xs">
                    <Link
                      className="text-blue-500 block truncate" 
                      href={`/admin/grants/detail/${grant.id}`}
                      title = {grant.name}
                    >
                      {grant.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 border-b">
                    {grant.representativeGrant?.[0]?.representative?.grantor?.organization?.name ? (
                      <Link
                        className="text-blue-500"
                        href={`/admin/grants/grantor/detail/${grant.representativeGrant[0].representative.grantorId}`}
                      >
                        {grant.representativeGrant[0].representative.grantor.organization.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {grant.representativeGrant?.[0]?.representative?.person?.firstName &&
                    grant.representativeGrant?.[0]?.representative?.person?.lastName
                      ? `${grant.representativeGrant[0].representative.person.firstName} ${grant.representativeGrant[0].representative.person.lastName}`
                      : "—"}
                  </td>
                  
                  <td className="px-6 py-4 border-b">{grant.status}</td>
                  <td className="px-6 py-4 border-b">{grant.purpose}</td>
                  <td className="px-6 py-4 border-b">
                    {grant.startDate ? new Date(grant.startDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {grant.endDate ? new Date(grant.endDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4 border-b">${grant.amountAwarded}</td>
                </tr>
              )) ?? null}
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
    whiteSpace: "nowrap",
  },
  tableCell: {
    borderTop: "1px solid #ccc",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    marginLeft: "auto",
    marginRight: "auto",
  },
  /*pagination: {
    display: "flex",
    justifyContent: "left",
    width: "100%",
    backgroundColor: "#cccccc",
  },*/
  /*breadcrumb: {
    marginLeft: "5px",
    marginTop: "8px"
  }*/
};
