import React from "react";
import { SecondarySideBar } from "../../components/SecondarySideBar";

export default function GrantsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SecondarySideBar
        items={[
          { name: "Grants List", reference: "/Grants" },
          { name: "Add a Grant", reference: "/Grants/Add" },
          { name: "Grantor List", reference: "/Grants/Grantor" },
        ]}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
