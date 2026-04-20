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
  dateSubmitted: string;
  orientationInvitation?: {
    id: string;
    status: "DRAFT" | "SENT" | "CONFIRMED" | "EXPIRED";
    firstEmailSentAt: string | null;
  } | null;
}

const headCells = [
  { id: "name", numeric: false, label: "Name" },
  { id: "email", numeric: false, label: "Email" },
  { id: "joined", numeric: false, label: "Joined" },
  { id: "registration", numeric: false, label: "Registration Status" },
  { id: "orientation", numeric: false, label: "Orientation" },
  { id: "actions", numeric: false, label: "Actions" },
];

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scheduleTarget, setScheduleTarget] = useState<Volunteer | null>(null);

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

  const isNewVolunteer = (dateSubmitted: string) => {
    const submitted = new Date(dateSubmitted).getTime();
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    return now - submitted <= sevenDaysMs;
  };

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
                    <div className="flex items-center gap-2">
                      <Link
                        className="text-blue-500"
                        href={`/admin/volunteer/${volunteer.id}`}
                      >
                        {`${volunteer.firstName} ${volunteer.lastName}`}
                      </Link>
                      {isNewVolunteer(volunteer.dateSubmitted) && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                          New Volunteer
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b">{volunteer.emailAddress}</td>
                  <td className="px-6 py-4 border-b">
                    {new Date(volunteer.dateSubmitted).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {volunteer.registration ? "Registered" : "Not Registered"}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {volunteer.orientationInvitation?.firstEmailSentAt
                      ? "Email sent"
                      : "Not sent"}
                  </td>
                  <td className="px-6 py-4 border-b">
                    <button
                      type="button"
                      onClick={() => setScheduleTarget(volunteer)}
                      className="bg-[#2f4b7c] hover:bg-[#1f3659] text-white text-sm font-semibold py-2 px-3 rounded"
                    >
                      Schedule Orientation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {scheduleTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-2">Schedule Orientation</h3>
              <p className="text-sm text-gray-700 mb-4">
                Starting from this volunteer row: <strong>{scheduleTarget.firstName} {scheduleTarget.lastName}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-6">
                The full scheduling setup (meeting link + click-to-select availability) is the next slice.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded"
                  onClick={() => setScheduleTarget(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
