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
          { name: "Donations List", reference: "/Donations" },
          { name: "Add a Donation", reference: "/Donations/Add" },
        ]}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
