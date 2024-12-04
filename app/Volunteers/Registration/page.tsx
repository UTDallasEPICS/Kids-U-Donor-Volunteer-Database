"use client";
import React, { useState } from "react";
import Link from "@/node_modules/next/link";
import { FormControl, TextField } from "@/node_modules/@mui/material/index";
import { VolRegTable } from "./VolRegTable";

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
    role: "volunteer",
    email: "testuser@example.com",
    firstName: "Test",
    lastName: "User",
  };

  // Example usage:
  console.log(testUser);

  return (
    <div className={"flex font-sans"}>
      <div className="flex-grow p-5">
        {testUser.role === "volunteer" ? (
          <VolRegTable data={eventTestData} />
        ) : (
          // <VolRegTable data={eventTestData} />
          <div>here</div>
        )}
      </div>
    </div>
  );
}