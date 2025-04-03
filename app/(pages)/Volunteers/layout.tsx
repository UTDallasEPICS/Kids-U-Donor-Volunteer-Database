import React from "react";
import { SecondarySideBar } from "@/app/components/SecondarySideBar";

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SecondarySideBar
        items={[
          { name: "Registration", reference: "/Volunteers/Registration" },
          { name: "Mail", reference: "/Volunteers/Mail" },
          { name: "Check-In / Out", reference: "/Volunteers/Checkinout" },
        ]}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
