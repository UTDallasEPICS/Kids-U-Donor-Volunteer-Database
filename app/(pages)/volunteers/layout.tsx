import React from "react";
import MainSidebar from "@/app/components/main-sidebar";
import TopNavigationBar from "@/app/components/volunteer-top-navigation-bar"; 

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigationBar />
      <div className="flex">
        <MainSidebar
          items={[
            { name: "Dashboard", reference: "/volunteers" },
            { name: "Register For Event", reference: "/volunteers/registration" },
            { name: "Check-In / Out", reference: "/volunteers/check_in_out" },
            { name: "Apply", reference: "/volunteers/apply" },
          ]}
        />
          <main className="ml-64 mt-16 min-h-screen flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
