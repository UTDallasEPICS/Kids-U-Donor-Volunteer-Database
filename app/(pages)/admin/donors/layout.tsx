import React from "react";
import { SecondarySideBar } from "../../../components/secondary-sidebar";

export default function DonorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SecondarySideBar
        items={[
          { name: "Donations List", reference: "/admin/donations" },
          { name: "Donors List", reference: "/admin/donors" },
          { name: "Add a Donation", reference: "/admin/donations/add" },
          { name: "Add a Donor", reference: "/admin/donors/add" },
        ]}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
