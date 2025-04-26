'use client'; 

import React from "react";
import MainSidebar from "@/app/components/main-sidebar";
import TopNavigationBar from "@/app/components/volunteer-top-navigation-bar";

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
  
      <div className="w-full">
        <TopNavigationBar />
      </div>

      <div className="flex">
   
        <MainSidebar
          items={[
            { name: "Dashboard", reference: "./" },
            { name: "Donations", reference: "/admin/donations" },
            { name: "Donors", reference: "/admin/donors" },
            { name: "Grants", reference: "/admin/grants" },
            { name: "Volunteers", reference: "/admin/volunteer" },
          ]}
        />

        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
}
