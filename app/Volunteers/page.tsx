"use client";
import React, { useState, useEffect } from "react";
import { SecondarySideBar } from "../components/SecondarySideBar";

export default function GrantsPage() {
  const Header = () => (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-bold text-gray-800">Volunteers</h1>
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
        <Header />
        {/* <SearchBar /> */}
      </div>
    </div>
  );
}
