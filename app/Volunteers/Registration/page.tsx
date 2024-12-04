"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FormControl, TextField } from "@mui/material";
import { data } from "@remix-run/router";
import router from "next/router";

import { AdminRegTable } from "./AdminRegTable";
import RegistrationQuestions from "./RegistrationQuestions";

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
    role: "admin", //admin or volunteer
    email: "testuser@example.com",
    firstName: "Test",
    lastName: "User",
  };

  // Example usage:
  console.log(testUser);

  return (
    <div className={"flex font-sans"}>
      <div className="flex-grow p-5">
        {testUser.role === "admin" ? (
          <AdminRegTable data={eventTestData} />
        ) : (
          // <VolRegTable data={eventTestData} />
          <div>
            After clicking reg on user side
            <RegistrationQuestions />
          </div>
        )}
      </div>
    </div>
  );
}
