import React from "react";
import Link from "next/link";

interface Message {
  ID: number;
  Event: string;
  Schedule: string;
  Subject: string;
  Sent: string;
  Active: boolean;
  Edit: string; //this is a button not a string
}

const NewMail: React.FC = () => {
  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Mail</span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">New Mail</span>
    </div>
  );

  return (
    <div className={"flex font-sans"}>
      <div className="flex-grow p-5">
        <Breadcrumb />
        Here
      </div>
    </div>
  );
};

export default NewMail;
