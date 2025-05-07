"use client";
import React from "react";
import { VolRegTable } from "./components/view_events/VolRegTable";

export default function Registration() {
  return (
    <div className="flex font-sans">
      <div className="flex-grow p-5">
        <VolRegTable />
        
      </div>
    </div>
  );
}
