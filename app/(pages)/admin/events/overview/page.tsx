"use client";
import React from "react";
import { AdminRegTable } from "./components/view_registrations/AdminRegTable";
import { useRouter } from "next/navigation";

export default function EventsOverviewPage() {
  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Volunteers</span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Events Overview</span>
    </div>
  );

  return (
    <div className="flex font-sans">
      <div className="flex-grow p-5">
        <Breadcrumb />
        <AdminRegTable />
      </div>
    </div>
  );
}