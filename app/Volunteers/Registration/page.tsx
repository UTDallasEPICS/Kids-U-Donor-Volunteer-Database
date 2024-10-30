"use client";
import React, { useState } from "react";
import Link from "@/node_modules/next/link";
import { FormControl, TextField } from "@/node_modules/@mui/material/index";
export default function Registration() {

  

    const Breadcrumb = () => (
        <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
          <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
            Home
          </span>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-700">Registration</span>
        </div>
      );

      const Header = () => (
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Events</h1>
          <div className="px-4 py-2 ml-2">
            <Link href="/Volunteers/Registration/New_event">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
                Add A New Event
            </button>
          </Link>
          </div>
        </div>
      );


    return (
      <div className={"flex font-sans"}>
        <div className="flex-grow p-5">
        <Breadcrumb />
        <Header />

        </div>
      </div>

    );
 }