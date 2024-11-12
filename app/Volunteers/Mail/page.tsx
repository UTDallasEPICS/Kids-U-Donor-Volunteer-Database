"use client";
import { MailTable } from "./MailTable";
import EditMail from "./NewMail/page";
import { useRouter } from "next/router";

import React, { useState, useEffect } from "react";
// import type { Mail } from "@/prisma";
import Link from "next/link";

interface Message {
  ID: number;
  Event: string;
  Schedule: string;
  Subject: string;
  Sent: string;
  Active: string;
}

const Mail: React.FC = () => {
  const peopleData: Message[] = [
    {
      ID: 8432,
      Event: "Tutoring",
      Schedule: "Send 1 week after activity occurrence",
      Subject: "Thank you for volunteering!",
      Sent: "7 email(s) sent",
      Active: "Yes",
    },
    {
      ID: 7215,
      Event: "Mentorship Program",
      Schedule: "Send 3 days before activity occurrence",
      Subject: "Mentorship Program Volunteer Reminder",
      Sent: "No email(s) sent",
      Active: "Yes",
    },
    {
      ID: 7043,
      Event: "Gala 2024",
      Schedule: "Send 1 month before activity occurrence",
      Subject: "Gala 2024 Volunteer Registration",
      Sent: "14 email(s) sent",
      Active: "Yes",
    },
  ];

  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Mail</span>
    </div>
  );

  const Header = () => (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-bold text-gray-800">
        Volunteer Mail Messages
      </h1>
      <div className="px-4 py-2 ml-2">
        <Link href="/Volunteers/Mail/NewMail">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
            Create New Mail Message
          </button>
        </Link>
      </div>
    </div>
  );

  const SearchBar = () => (
    <div className="flex mb-5">
      <input
        type="text"
        placeholder="Quick Search"
        className="p-2 border border-gray-300 rounded-l-md focus:outline focus:ring-2 focus:ring-blue-500"
      />
      <button className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors duration-200">
        Go
      </button>
      <button className="px-4 py-2 ml-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200">
        Advanced
      </button>
    </div>
  );

  return (
    <div className={"flex font-sans"}>
      <div className="flex-grow p-5">
        <Breadcrumb />
        <Header />
        <SearchBar />
        <MailTable data={peopleData} />
      </div>
    </div>
  );
};

export default Mail;

/*
export default function Mail() {
  // const [mailData, setMailData] = useState<Mail[]>([]); // State to store mail data

  // useEffect(() => {
  //   fetchMailData();
  // }, []);

  // const fetchMailData = async () => {
  //   try {
  //     const response = await fetch("/api/volunteer/");
  //     const result = await response.json();
  //     setMailData(result.data);
  //   } catch (error) {
  //     console.error("Error fetching volunteers:", error);
  //   }
  // };
//   );
// }
*/
