import React from "react";
import { SecondarySideBar } from "@/app/components/SecondarySideBar";

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SecondarySideBar
        items={[
          { name: "Registration", reference: "/volunteers/Registration" },
          { name: "Mail", reference: "/volunteers/Mail" },
          { name: "Check-In / Out", reference: "/volunteers/Checkinout" },
        ]}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
