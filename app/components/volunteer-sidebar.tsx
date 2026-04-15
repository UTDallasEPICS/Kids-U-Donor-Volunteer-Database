"use client";
import { useEffect, useState } from "react";
import MainSidebar from "./main-sidebar";

export default function VolunteerSidebar() {
  const [appRejected, setAppRejected] = useState(false);
  const [bgRejected, setBgRejected] = useState(false);

  useEffect(() => {
    fetch("/api/volunteer/status")
      .then((res) => res.json())
      .then((data) => {
        setAppRejected(data.appStatus === "REJECTED");
        setBgRejected(data.bgCheckStatus === "REJECTED");
      })
      .catch(() => {});
  }, []);

  return (
    <MainSidebar
      items={[
        { name: "Dashboard", reference: "/volunteers" },
        { name: "Register For Event", reference: "/volunteers/registration" },
        { name: "Check-In / Out", reference: "/volunteers/check_in_out" },
        {
          name: "Apply",
          reference: "/volunteers/apply",
          hasSubmenu: true,
          hasBadge: appRejected || bgRejected,
          submenuItems: [
            {
              name: "Volunteer Application",
              reference: "/volunteers/apply",
              hasBadge: appRejected,
            },
            {
              name: "Background Check",
              reference: "/volunteers/apply/background-check",
              hasBadge: bgRejected,
            },
          ],
        },
      ]}
    />
  );
}
