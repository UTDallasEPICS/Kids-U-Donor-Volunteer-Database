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

  const fetchGrantorsData = async () => {
    try {
      const response = await fetch(`/api/admin/grantors/get`);
      const result = await response.json();
      setGrantorsData(result.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching grantors:", error);
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
    <div className="flex font-sans">
      <div className="flex-grow p-5">
        <Breadcrumb />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Grantors</h2>
          <Link
            href="/admin/grants/grantor/add"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Grantor
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
              {grantorsData?.map((grantor) => (
                <tr key={grantor.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 border-b">
                    <Link
                      className="text-blue-500"
                      href={`/admin/grants/grantor/detail/${grantor.id}`}
                    >
                      {grantor.organization?.name || "—"}
                    </Link>
                  </td>
                  <td className="px-6 py-4 border-b">{grantor.type || "—"}</td>
                  <td className="px-6 py-4 border-b">
                    {grantor.organization?.address?.addressLine1 || "—"}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {grantor.organization?.address?.city || "—"}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {grantor.organization?.address?.state || "—"}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {grantor.organization?.address?.zipCode || "—"}
                  </td>
                  <td className="px-6 py-4 border-b">
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
    backgroundColor: "#ccc",
  },*/
  /*breadcrumb: {
    marginLeft: "5px",
    marginTop: "8px"
  }*/
};