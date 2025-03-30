// AdminRegTable.tsx
"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Event {
  ID: number;
  Name: string;
  Date: Date;
  Time: Date;
  Description: string;
  LocationID: number;
}

interface TableProps {
  data: Event[];
}

export const AdminRegTable: React.FC<TableProps> = ({ data }) => {
  const router = useRouter();

  const [events, setEvents] = useState(
    data.map((item) => ({
      ID: item.ID,
      Name: item.Name,
      Date: item.Date,
      Time: item.Time,
      Description: item.Description,
      LocationID: item.LocationID,
    }))
  );

  const handleViewVolunteers = (curEvent: Record<string, any>) => {
    // Create a query string from curEvent
    const queryString = new URLSearchParams(curEvent).toString();
    // Navigate to the desired path with the query string
    router.push(`/volunteers/Registration/View_volunteers?${queryString}`);
  };

  const handleNavigation = (curEvent: Event) => {
    router.push({
      pathname: "/volunteers/Registration/View_volunteers",
      query: { data: JSON.stringify(curEvent) },
    } as any);
  };

  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">Home</span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Registration</span>
    </div>
  );

  const Header = () => (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-bold text-gray-800">Events</h1>
      <div className="px-4 py-2 ml-2">
        <Link href="/volunteers/Registration/New_event">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
            Add A New Event
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div>
      <Breadcrumb />
      <Header />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse mb-5">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-100">ID</th>
              <th className="border border-gray-300 p-2 bg-gray-100">Name</th>
              <th className="border border-gray-300 p-2 bg-gray-100">Date</th>
              <th className="border border-gray-300 p-2 bg-gray-100">Time</th>
              <th className="border border-gray-300 p-2 bg-gray-100">Description</th>
              <th className="border border-gray-300 p-2 bg-gray-100">LocationID</th>
              <th className="border border-gray-300 p-2 bg-gray-100">Volunteers</th>
              <th className="border border-gray-300 p-2 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-2 px-4 border-b">{event.ID}</td>
                <td className="py-2 px-4 border-b">{event.Name}</td>
                <td className="py-2 px-4 border-b">{format(event.Date, "yyyy-MM-dd")}</td>
                <td className="py-2 px-4 border-b">{format(event.Time, "HH:mm:ss")}</td>
                <td className="py-2 px-4 border-b">{event.Description}</td>
                <td className="py-2 px-4 border-b">{event.LocationID}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleViewVolunteers(event)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    View
                  </button>
                </td>
                <td className="py-2 px-4 border-b flex flex-col">
                  <button className="text-blue-500 mb-2">Edit</button>
                  <button className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
