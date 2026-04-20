import React from "react";
import VolunteerSidebar from "@/app/components/volunteer-sidebar";
import TopNavigationBar from "@/app/components/volunteer-top-navigation-bar";

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigationBar />
      <div className="flex">
        <VolunteerSidebar />
        <main className="ml-64 mt-16 min-h-screen flex-1">{children}</main>
      </div>
    </div>
  );
}
