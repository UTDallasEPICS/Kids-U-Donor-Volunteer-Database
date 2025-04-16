import React from "react";
import { SecondarySideBar } from "@/app/components/secondary-sidebar";

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SecondarySideBar
        items={[
          { name: "Events Overview", reference: "/volunteers/events/overview" },
          { name: "Register For Event", reference: "/volunteers/events" },
          { name: "Add New Event", reference: "/volunteers/Registration/add-event" },
          { name: "Mail", reference: "/volunteers/Mail" },
          { name: "Check-In / Out", reference: "/volunteers/check_in_out" },
        ]}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
