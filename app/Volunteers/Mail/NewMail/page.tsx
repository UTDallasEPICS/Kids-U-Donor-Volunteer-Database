import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

interface Message {
  ID: number;
  Event: string;
  Schedule: string;
  Subject: string;
  Sent: string;
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

  const Header = () => (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-bold text-gray-800">Mail Message</h1>
    </div>
  );

  const Body = () => (
    <div className="flex justify-between items-center mb-5">
      <h1>Here</h1>
      <h3>here</h3>
    </div>
  );

  return (
    <div className={"flex font-sans"}>
      <div className="flex-grow p-5">
        <Breadcrumb />
        <Header />
        <Body />
      </div>
    </div>
  );
};

export default NewMail;
