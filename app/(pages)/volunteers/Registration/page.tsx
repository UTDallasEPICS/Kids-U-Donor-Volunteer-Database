"use client";
import React from "react";
import { VolRegTable } from "./VolRegTable";
import { AdminRegTable } from "../../admin/events/overview/components/view_registrations/AdminRegTable";
import RegistrationQuestions from "./registration_form/RegistrationQuestions";

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
