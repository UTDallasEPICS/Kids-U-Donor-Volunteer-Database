import React from "react";
import { SecondarySideBar } from "../../components/SecondarySideBar";

export default function DonorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SecondarySideBar
        items={[
          { name: "Donations List", reference: "/donations" },
          { name: "Donors List", reference: "/Donors" },
          { name: "Add a Donation", reference: "/donations/Add" },
          { name: "Add a Donor", reference: "/Donors/Add" },
        ]}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
