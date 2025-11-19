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
              { name: "Donations List", reference: "/admin/donations" },
              { name: "Donors List", reference: "/admin/donors" },
              { name: "Add a Donation", reference: "/admin/donations/add" },
              { name: "Add a Donor", reference: "/admin/donors/add" },
              { name: "Import", reference: "/admin/donors/import" },
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
              { name: "Import", reference: "/admin/grants/import" },
            ]
          },
          {
            name: "Export",
            reference: "/admin/export",
          },
          { 
            name: "Volunteers", 
            reference: "/admin/volunteer", 
            hasSubmenu: true,
            submenuItems: [
              { name: "Volunteers List", reference: "/admin/volunteer" },
              { name: "View Registrations", reference: "/admin/events/overview" },
              { name: "View Applications", reference: "/admin/volunteer/application" },
            ]
          },
          { 
            name: "Events", 
            reference: "/admin/events", 
            hasSubmenu: true,
            submenuItems: [
              { name: "Add Orientation", reference: "/admin/orientations/add_orientation" },
              { name: "View Orientations", reference: "/admin/orientations/view_orientations" },
              { name: "Add Event", reference: "/admin/events/add-event" },
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
