import React from "react";
import { SecondarySideBar } from "../components/SecondarySideBar";

export default function GrantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SecondarySideBar
        items={[
          { name: "Check-In / Out", reference: "/Volunteer/Checkinout" },
          { name: "Mail", reference: "/Volunteer/Mail" },
          { name: "Registration", reference: "/Volunteer/Registration" }
        ]}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
