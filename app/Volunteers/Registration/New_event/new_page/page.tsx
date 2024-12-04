"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function NewPage() {
  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Registration</span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Add Event</span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">New page</span>
    </div>
  );

  const Header = () => (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-bold text-gray-800"> New Page</h1>
    </div>
  );

  const Form = () => (
    <div className="input">
      <form>
        <label htmlFor="name"> Name: </label>
        <input type="text" id="name" name="name"></input>
        <label htmlFor="date">Date</label>
        <input type="date" id="date" name="date"></input>
      </form>
    </div>
  );

  return (
    <div className={"flex font-sans"}>
      <div className="flex-grow p-5">
        <Breadcrumb />
        <Header />
        <Form />
      </div>
    </div>
  );
}
