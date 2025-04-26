import React from "react";
import { SecondarySideBar } from "@/app/components/secondary-sidebar";

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SecondarySideBar
        items={[
          { name: "Volunteers List", reference: "./volunteer" },
          { name: "Mail", reference: "/volunteers/Mail" },
          { name: "Check-In / Out", reference: "/volunteers/check_in_out" },
          { name: "Add Orientation", reference: "./orientations/add_orientation" },
          { name: "View Orientations", reference: "./orientations/view_orientations" },
          { name: "Add Event", reference: "./events/add-event" },
          { name: "View Registrations", reference: "./events/overview" },
          
         
        ]}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
