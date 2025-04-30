import React from "react";
import MainSidebar from "@/app/components/main-sidebar";
import TopNavigationBar from "@/app/components/volunteer-top-navigation-bar"; 

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
  
      <div className="w-full">
        <TopNavigationBar />
      </div>
    <div className="flex">
      <MainSidebar
        items={[

          { name: "Register For Event", reference: "/volunteers/registration" },
          { name: "Mail", reference: "/volunteers/mail" },
          { name: "Check-In / Out", reference: "/volunteers/check_in_out" },
          { name: "Apply", reference: "/volunteers/apply" },

          
        ]}
      />
      <div className="flex-grow">{children}</div>
    </div>
    </div>
  );
}
{/*import React from "react";
import MainSidebar from "@/app/components/main-sidebar";
import TopNavigationBar from "@/app/components/volunteer-top-navigation-bar"; 

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
  
      <div className="w-full">
        <TopNavigationBar />
      </div>

      <div className="flex">
        <MainSidebar
          items={[
            { name: "Register For Event", reference: "/volunteers/registration" },
            { name: "Mail", reference: "/volunteers/mail" },
            { name: "Check-In / Out", reference: "/volunteers/check_in_out" },
          ]}
        />
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
}

 */}