import React from "react";
import { SecondarySideBar } from "../../components/secondary-sidebar";

export default function GrantsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SecondarySideBar
        items={[
          { name: "Grants List", reference: "/grants" },
          { name: "Add a Grant", reference: "/grants/Add" },
          { name: "Grantor List", reference: "/grants/Grantor" },
        ]}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
