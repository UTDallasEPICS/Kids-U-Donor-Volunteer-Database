import React from "react";
import { SecondarySideBar } from "../components/SecondarySideBar";

export default function DonationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SecondarySideBar
        items={[
          { name: "Donations List", reference: "/Donations" },
          { name: "Add a Donations", reference: "/Donations/Add" },
        ]}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
