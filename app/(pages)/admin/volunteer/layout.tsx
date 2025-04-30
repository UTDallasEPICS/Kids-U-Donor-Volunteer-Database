import React from "react";
import { SecondarySideBar } from "@/app/components/secondary-sidebar";

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SecondarySideBar
        items={[
          { name: "Volunteers List", reference: "./volunteer" },
          { name: "Add Orientation", reference: "./orientations/add_orientation" },
          { name: "View Orientations", reference: "./orientations/view_orientations" },
          { name: "Add Event", reference: "./events/add-event" },
          { name: "View Registrations", reference: "./events/overview" },
          { name: "View Applications", reference: "./volunteer/application" },

          
         
        ]}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
