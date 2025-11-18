"use client"; 

import React from "react";
import MainSidebar from "@/app/components/main-sidebar";
import TopNavigationBar from "@/app/components/admin-top-navigation-bar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigationBar />

      <MainSidebar
        items={[
          { name: "Dashboard", reference: "/admin" },
          { 
            name: "Donations", 
            reference: "/admin/donations", 
            hasSubmenu: true,
            submenuItems: [
              { name: "Donation List", reference: "/admin/donations" },
              { name: "Donor List", reference: "/admin/donors" },
              { name: "Add a Donation", reference: "/admin/donations/add" },
              { name: "Add a Donor", reference: "/admin/donors/add" },
              { name: "Import", reference: "/admin/donations/import" },
              { name: "Export", reference: "/admin/donations/export" },
            ]
          },
          { 
            name: "Grants", 
            reference: "/admin/grants", 
            hasSubmenu: true,
            submenuItems: [
              { name: "Grants List", reference: "/admin/grants" },
              { name: "Add a Grant", reference: "/admin/grants/add" },
              { name: "Grantor List", reference: "/admin/grants/grantor" },
            ]
          },
          { 
            name: "Volunteers", 
            reference: "/admin/volunteer", 
            hasSubmenu: true,
            submenuItems: [
              { name: "Volunteers List", reference: "/admin/volunteer" },
              { name: "Add a Volunteer", reference: "/admin/volunteer/add" },
              { name: "Hours Log", reference: "/admin/volunteer/hours" },
            ]
          },
        ]}
      />

      <main className="ml-64 mt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}

          // { name: "Donations List", reference: "/admin/donations" },
          // { name: "Donors List", reference: "/admin/donors" },
          // { name: "Add a Donation", reference: "/admin/donations/add" },
          // { name: "Add a Donor", reference: "/admin/donors/add" },
          // { name: "Grants List", reference: "/admin/grants" },
          // { name: "Add a Grant", reference: "/admin/grants/add" },
          // { name: "Grantor List", reference: "/admin/grants/grantor" },
          // { name: "Volunteers List", reference: "/admin/volunteer" },
          // { name: "Add Orientation", reference: "./orientations/add_orientation" },
          // { name: "View Orientations", reference: "./orientations/view_orientations" },
          // { name: "Add Event", reference: "./events/add-event" },
          // { name: "View Registrations", reference: "./events/overview" },
          // { name: "View Applications", reference: "./volunteer/application" },