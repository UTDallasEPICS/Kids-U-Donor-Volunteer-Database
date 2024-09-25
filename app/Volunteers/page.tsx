"use client";
import React, { useState, useEffect } from "react";
import type { Volunteer } from "@/prisma";
import Link from "next/link";
import { SecondarySideBar } from "../components/SecondarySideBar";

export default function GrantsPage() {
  const [grantsData, setGrantsData] = useState<Grant[]>([]); // State to store grants data

  useEffect(() => {
    fetchGrantsData();
  }, []);

  const fetchGrantsData = async () => {
    try {
      const response = await fetch("/api/grants/");
      const result = await response.json();
      setGrantsData(result.data);
    } catch (error) {
      console.error("Error fetching grants:", error);
    }
  };

  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Grants</span>
    </div>
  );

  const Header = () => (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-bold text-gray-800">Grants</h1>
      <div className="px-4 py-2 ml-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
          Add A New Grant
        </button>
      </div>
    </div>
  );

  const SearchBar = () => (
    <div className="flex mb-5">
      <input
        type="text"
        placeholder="Quick Search"
        className="p-2 border border-gray-300 rounded-l-md focus:outline focus:ring-2 focus:ring-blue-500"
      />
      <button className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors duration-200">
        Go
      </button>
      <button className="px-4 py-2 ml-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200">
        Advanced
      </button>
    </div>
  );

  //This table dynamically creates rows with each grant
  const GrantsTable = ({ grants }: { grants: Grant[] }) => {
    // Debugging
    if (!Array.isArray(grants)) {
      return <div>Error: Grants is not an array</div>;
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mb-5">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-100">
                Organization
              </th>
              <th className="border border-gray-300 p-2 bg-gray-100">
                Grant Name
              </th>
              <th className="border border-gray-300 p-2 bg-gray-100">
                Grant Status
              </th>
              <th className="border border-gray-300 p-2 bg-gray-100">
                Requested Amount
              </th>
              <th className="border border-gray-300 p-2 bg-gray-100">
                Awarded Amount
              </th>
              <th className="border border-gray-300 p-2 bg-gray-100">
                Restriction
              </th>
              <th className="border border-gray-300 p-2 bg-gray-100">
                Report Due Date
              </th>
              <th className="border border-gray-300 p-2 bg-gray-100">
                Due Date
              </th>
              <th className="border border-gray-300 p-2 bg-gray-100">
                Award Date
              </th>
            </tr>
          </thead>
          <tbody>
            {grants.map((grant) => (
              <tr key={grant.GrantID}>
                <td className="border border-gray-300 p-2">
                  {grant.Representative
                    ? grant.Representative[0].FirstName
                    : "N/A"}
                </td>
                <td className="border border-gray-300 p-2 text-blue-500">
                  <Link href={`/Grants/Detail/${grant.GrantID}`}>
                    {grant.GrantName}
                  </Link>
                </td>
                <td className="border border-gray-300 p-2">
                  {grant.AwardStatus || "Pending"}
                </td>
                <td className="border border-gray-300 p-2">
                  ${grant.AskAmount || "0.00"}
                </td>
                <td className="border border-gray-300 p-2">
                  ${grant.AmountAwarded || "0.00"}
                </td>
                <td className="border border-gray-300 p-2">
                  {grant.FundingRestrictions || "None"}
                </td>
                <td className="border border-gray-300 p-2">
                  {grant.EndOfGrantReportDueDate
                    ? new Date(
                        grant.EndOfGrantReportDueDate
                      ).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {grant.GrantDueDate
                    ? new Date(grant.GrantDueDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {grant.AwardDate
                    ? new Date(grant.AwardDate).toLocaleDateString()
                    : "Not Awarded Yet"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={"flex font-sans"}>
      <div className="flex-grow p-5">
        <Breadcrumb />
        <Header />
        <SearchBar />
        <GrantsTable grants={grantsData} />
      </div>
    </div>
  );
}
