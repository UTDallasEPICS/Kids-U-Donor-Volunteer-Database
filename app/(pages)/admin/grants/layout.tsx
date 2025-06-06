import React from "react";
import { SecondarySideBar } from "../../../components/secondary-sidebar";

export default function GrantsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SecondarySideBar
        items={[
          { name: "Grants List", reference: "/admin/grants" },
          { name: "Add a Grant", reference: "/admin/grants/add" },
          { name: "Grantor List", reference: "/admin/grants/grantor" },
        ]}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
