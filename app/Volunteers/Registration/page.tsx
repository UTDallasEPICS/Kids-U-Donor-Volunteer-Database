"use client";
import React, { useState } from "react";
import Link from "@/node_modules/next/link";
import { FormControl, TextField } from "@/node_modules/@mui/material/index";
import { AdminRegTable } from "./AdminRegTable";

interface Event {
  ID: number;
  Name: string;
  Date: Date;
  Time: Date;
  Description: string;
  LocationID: number;
}

export default function Registration() {
  const eventTestData: Event[] = [
    {
      ID: 8432,
      Name: "Tutoring",
      Date: new Date("2024-11-19"),
      Time: new Date("2024-11-19T14:00:00"),
      Description: "Tutor elementary school kids on various subjects. ",
      LocationID: 1876,
    },
    {
      ID: 7532,
      Name: "Fundraising",
      Date: new Date("2024-11-19"),
      Time: new Date("2024-11-19T14:00:00"),
      Description: "Help manage the Kids-U stand to fundraise.",
      LocationID: 1876,
    },
  ];

  const testUser = {
    username: "testUser",
    role: "admin",
    email: "testuser@example.com",
    firstName: "Test",
    lastName: "User",
  };

  // Example usage:
  console.log(testUser);

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
        <Link href="/Volunteers/Registration/New_event">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
            Add A New Event
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className={"flex font-sans"}>
      <div className="flex-grow p-5">
        <Breadcrumb />
        <Header />
        {testUser.role === "admin" ? (
          <AdminRegTable data={eventTestData} />
        ) : (
          // <VolRegTable data={eventTestData} />
          <div>here</div>
        )}
      </div>
    </div>
  );
}
