"use client";
import React from "react";
import { VolRegTable } from "./VolRegTable";
import { AdminRegTable } from "./AdminRegTable";
import RegistrationQuestions from "./RegistrationQuestions";

export default function Registration() {
  //test user object
  const testUser = {
    username: "testUser",
    role: "volunteer", //admin or volunteer
    email: "testuser@example.com",
    firstName: "Test",
    lastName: "User",
  };

  return (
    <div className={"flex font-sans"}>
      <div className="flex-grow p-5">
        {testUser.role === "admin" ? (
          <AdminRegTable />
        ) : (
          <div>
            <VolRegTable />
          </div>
        )}
      </div>
    </div>
  );
}
