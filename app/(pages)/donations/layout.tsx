import React from "react";
import { SecondarySideBar } from "../../components/secondary-sidebar";

export default function DonationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SecondarySideBar
        items={[
          { name: "Donations List", reference: "/donations" },
          { name: "Donors List", reference: "/donors" },
          { name: "Add a Donation", reference: "/donations/add" },
          { name: "Add a Donor", reference: "/donors/add" },
        ]}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
