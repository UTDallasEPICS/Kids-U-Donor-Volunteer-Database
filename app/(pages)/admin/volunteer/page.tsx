"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  registration: boolean;
}

const headCells = [
  { id: "name", numeric: false, label: "Name" },
  { id: "email", numeric: false, label: "Email" },
  { id: "registration", numeric: false, label: "Registration Status" },
];

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  const fetchVolunteersData = async () => {
    try {
      const response = await fetch("/api/volunteer/get", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || "Something went wrong";
        throw new Error(message);
      }

      const result = await response.json();
      setVolunteers(result.volunteers);
      setIsLoading(false);
    } catch (error) {
      router.push("/not-found");
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    fetchVolunteersData();
  }, []);

  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Volunteers</span>
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
          <h2 className="text-xl font-bold">Volunteers</h2>
          <Link
            href="/admin/volunteer/application"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Applications
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
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 border-b">
                    <Link
                      className="text-blue-500"
                      href={`/admin/volunteer/${volunteer.id}`}
                    >
                      {`${volunteer.firstName} ${volunteer.lastName}`}
                    </Link>
                  </td>
                  <td className="px-6 py-4 border-b">{volunteer.emailAddress}</td>
                  <td className="px-6 py-4 border-b">
                    {volunteer.registration ? "Registered" : "Not Registered"}
                  </td>
                </tr>
              ))}
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
