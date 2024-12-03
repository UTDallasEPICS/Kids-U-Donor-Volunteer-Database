"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FormControl, TextField } from "@mui/material";
import { data } from "@remix-run/router";
import router from "next/router";

export default function Registration() {
  //send data to the reg page
  const router = useRouter();
  // Sample data to populate the table
  const events = [
    { id: "event-1", name: "Event 1", location: "Location 1", date: "Date 1", description: "Description 1" },
    { id: "event-2", name: "Event 2", location: "Location 2", date: "Date 2", description: "Description 2" },
  ];

  const handleViewEvent = (id: string) => {
    // Navigate to the event details page with the id
    router.push(`/Volunteers/Registration/Event_Reg`);
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

    const Table = () => (
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left text-gray-600 border-r border-gray-300">Event Name</th>
            <th className="py-2 px-4 text-left text-gray-600 border-r border-gray-300">Location</th>
            <th className="py-2 px-4 text-left text-gray-600 border-r border-gray-300">Date</th>
            <th className="py-2 px-4 text-left text-gray-600">Details</th>
            <th className="py-2 px-4 text-left text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b">
              <td className="py-2 px-4 border-r border-gray-300">{event.name}</td>
              <td className="py-2 px-4 border-r border-gray-300">{event.location}</td>
              <td className="py-2 px-4 border-r border-gray-300">{event.date}</td>
              <td className="py-2 px-4 border-r border-gray-300">{event.description}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleViewEvent(event.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Click to register
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );


    return (
      <div className={"flex font-sans"}>
        <div className="flex-grow p-5">
        <Breadcrumb />
        <Header />
        <Table /> 
        </div>
      </div>

    );
 }

function setEventData(arg0: any) {
  throw new Error("Function not implemented.");
}
