// AdminRegTable.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Router } from "express";
// import RegistrationQuestions from "./RegistrationQuestions"; //delete later

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

export const VolRegTable: React.FC<TableProps> = ({ data }) => {
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

    const handleViewEvent = (id: number) => {
        // Navigate to the event details page with the id
        router.push(`/Volunteers/Registration/Event_Reg?eventID=${id}`);
      };

  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Registration</span>
    </div>
  );

  const Header = () => (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-bold text-gray-800">Events</h1>
      <div className="px-4 py-2 ml-2">
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
              <th className="border border-gray-300 p-2 bg-gray-100">
                Description
              </th>
              <th className="border border-gray-300 p-2 bg-gray-100">
                LocationID
              </th>
              <th className="border border-gray-300 p-2 bg-gray-100">
                Volunteers
              </th>
              <th className="border border-gray-300 p-2 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-2 px-4 border-b">{event.ID}</td>
                <td className="py-2 px-4 border-b">{event.Name}</td>
                <td className="py-2 px-4 border-b">
                  {format(event.Date, "yyyy-MM-dd")}
                </td>
                <td className="py-2 px-4 border-b">
                  {format(event.Time, "HH:mm:ss")}
                </td>
                <td className="py-2 px-4 border-b">{event.Description}</td>
                <td className="py-2 px-4 border-b">{event.LocationID}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleViewEvent(event.ID)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Click to Register
                  </button>
                  {/* <Link href="/Volunteers/Registration/View_volunteers">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
                    Add A New Event
                  </button>
                </Link> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <RegistrationQuestions /> */}
      </div>
    </div>
  );
};