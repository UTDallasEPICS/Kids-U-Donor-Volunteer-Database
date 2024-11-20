"use client"; // Add this line to mark the component as a Client Component

import { useState, useEffect } from "react";

const Breadcrumb = () => (
  <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
    <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
      Home
    </span>
    <span className="text-gray-400">/</span>
    <span className="font-semibold text-gray-700">Checkin : Checkout</span>
  </div>
);

export default function Checkinout() {
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [message, setMessage] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

  // Manual entry state for Column 2
  const [manualCheckInDate, setManualCheckInDate] = useState<string>("");
  const [manualCheckInTime, setManualCheckInTime] = useState<string>("");
  const [manualCheckOutDate, setManualCheckOutDate] = useState<string>("");
  const [manualCheckOutTime, setManualCheckOutTime] = useState<string>("");

  // Handle automatic Check-In
  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    const checkInMessage = `Check-In Time: ${now.toLocaleTimeString()}`;
    setMessage(checkInMessage);
    setVisible(true);
    console.log(checkInMessage);
  };

  // Handle automatic Check-Out
  const handleCheckOut = () => {
    if (checkInTime) {
      const now = new Date();
      const checkOutMessage = `Check-Out Time: ${now.toLocaleTimeString()}`;
      const hoursWorked = (
        (now.getTime() - checkInTime.getTime()) /
        (1000 * 60 * 60)
      ).toFixed(2);
      const hoursMessage = `Hours Volunteered: ${hoursWorked}`;
      console.log(checkOutMessage);
      console.log(hoursMessage);
      setMessage(`${checkOutMessage}\n${hoursMessage}`);
      setVisible(true);
      setCheckInTime(null);
    } else {
      const errorMessage = "Please check in first.";
      console.log(errorMessage);
      setMessage(errorMessage);
      setVisible(true);
    }
  };

  // Handle manual hours calculation
  const handleManualHours = () => {
    const checkIn = new Date(`${manualCheckInDate}T${manualCheckInTime}`);
    const checkOut = new Date(`${manualCheckOutDate}T${manualCheckOutTime}`);

    if (checkIn && checkOut && checkOut > checkIn) {
      const hoursWorked = (
        (checkOut.getTime() - checkIn.getTime()) /
        (1000 * 60 * 60)
      ).toFixed(2);
      const hoursMessage = `Hours Volunteered (Manual Entry): ${hoursWorked}`;
      setMessage(hoursMessage);
      setVisible(true);
      console.log(hoursMessage);
    } else {
      const errorMessage = "Invalid dates or times entered.";
      setMessage(errorMessage);
      setVisible(true);
      console.log(errorMessage);
    }
  };

  // Effect to handle fade-out after 10 seconds
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        setMessage("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <div className="p-6">
      <Breadcrumb />
      <h2 className="underline text-center mb-4 text-5xl font-semibold text-gray-700">
        Check-In / Check-Out
      </h2>

      <div className="flex items-start justify-center space-x-12 mt-10">
        {/* Column 1: Automatic Check-In/Check-Out */}
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Button Entry
          </h1>
          <button
            onClick={handleCheckIn}
            className="bg-blue-500 text-white rounded-sm p-2 w-60"
          >
            Check-In
          </button>
          <button
            onClick={handleCheckOut}
            className="bg-blue-500 text-white rounded-sm p-2 w-60"
          >
            Check-Out
          </button>
        </div>

        {/* Divider */}
        <div className="border-r border-gray-400 h-48 mx-8"></div>

        {/* Column 2: Manual Date and Time Entry */}
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-800">Manual Entry</h1>
          <div className="flex flex-col space-y-2">
            <input
              type="date"
              value={manualCheckInDate}
              onChange={(e) => setManualCheckInDate(e.target.value)}
              className="border rounded-md p-2"
              placeholder="Enter Check-In Date"
            />
            <input
              type="time"
              value={manualCheckInTime}
              onChange={(e) => setManualCheckInTime(e.target.value)}
              className="border rounded-md p-2"
              placeholder="Enter Check-In Time"
            />
            <input
              type="date"
              value={manualCheckOutDate}
              onChange={(e) => setManualCheckOutDate(e.target.value)}
              className="border rounded-md p-2"
              placeholder="Enter Check-Out Date"
            />
            <input
              type="time"
              value={manualCheckOutTime}
              onChange={(e) => setManualCheckOutTime(e.target.value)}
              className="border rounded-md p-2"
              placeholder="Enter Check-Out Time"
            />
          </div>
          <button
            onClick={handleManualHours}
            className="bg-green-500 text-white rounded-sm p-2 w-60 mt-4"
          >
            Calculate Hours
          </button>
        </div>
      </div>

      {/* Display message */}
      {message && (
        <div
          className={`mt-4 p-4 border rounded-lg bg-green-100 text-green-700 transition-opacity duration-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {message.split("\n").map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      )}
    </div>
  );
}
