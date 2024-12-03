"use client";
import React from "react";
import Link from "@/node_modules/next/link";

export default function AddEvent() {
  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Registration</span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Add Event</span>
    </div>
  );

  const Header = () => (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-bold text-gray-800">Add Events Page</h1>
    </div>
  );

  const Form = () => (
    <div className="space-y-6">
      <form className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 text-gray-700">
            Name of Event:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="date" className="mb-1 text-gray-700">
            Date:
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="time" className="mb-1 text-gray-700">
            {" "}
            Time of Event{" "}
          </label>
          <input
            type="time"
            id="time"
            name="time"
            className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></input>
        </div>

        <div className="flex flex-col">
          <label htmlFor="address" className="mb-1 text-gray-700">
            Location:
          </label>

          <select
            id="address"
            name="address"
            className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <optgroup label="Texas">
              <option value="dallas"> Dallas</option>
              <option value="plano"> Plano</option>
              <option value="garland"> Garland</option>
              <option value="arlignton"> Arlignton</option>
            </optgroup>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="number" className="mb-1 text-gray-700">
            Number of Participants Needed:
          </label>
          <input
            type="number"
            id="number"
            name="number"
            className="border-2 border-blue-400 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="mb-1 text-gray-1000">
            Description of Event:
          </label>
          <textarea
            id="description"
            name="description"
            className="border-2 border-blue-400 rounded-md p-3 text-gray-1000 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>

        <div>
          <input
            type="submit"
            id="submit"
            name="submit"
            className="w-full text-gray-800 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition-all duration-200 focus:ring-offset-1"
          ></input>
        </div>
      </form>
    </div>
  );

  return (
    <div className="flex font-sans min-h-screen bg-gray-100">
      <div className="flex-grow p-5">
        <Breadcrumb />
        <Header />
        <div className="px-4 py-2 ml-2">
          <Link href="/Volunteers/Registration/New_event/new_page">
            {/* Link content */}
          </Link>
        </div>
        <Form />
      </div>
    </div>
  );
}
