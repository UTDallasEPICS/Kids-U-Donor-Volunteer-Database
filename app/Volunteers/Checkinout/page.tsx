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
  const [checkInTime, setCheckInTime] = useState<Date | null>(null); // State to store check-in time
  const [message, setMessage] = useState<string>(""); // State to store messages
  const [visible, setVisible] = useState<boolean>(false); // State to control message visibility

  // Function to handle Check-In
  const handleCheckIn = () => {
    const now = new Date(); // Get the current time
    setCheckInTime(now); // Store the check-in time
    const checkInMessage = `Check-In Time: ${now.toLocaleTimeString()}`; // Create check-in message
    setMessage(checkInMessage); // Set message to display
    setVisible(true); // Show the message
    console.log(checkInMessage); // Print check-in time to console
  };

  // Function to handle Check-Out
  const handleCheckOut = () => {
    if (checkInTime) {
      const now = new Date(); // Get the current time
      const checkOutMessage = `Check-Out Time: ${now.toLocaleTimeString()}`; // Create check-out message
      console.log(checkOutMessage); // Print check-out time to console

      // Calculate hours volunteered
      const hoursWorked = (
        (now.getTime() - checkInTime.getTime()) /
        (1000 * 60 * 60)
      ).toFixed(2); // Calculate hours worked
      const hoursMessage = `Hours Volunteered: ${hoursWorked}`; // Create hours worked message
      console.log(hoursMessage); // Print hours volunteered to console

      // Set message to display
      setMessage(`${checkOutMessage}\n${hoursMessage}`);
      setVisible(true); // Show the message

      // Reset check-in time
      setCheckInTime(null);
    } else {
      const errorMessage = "Please check in first."; // Create error message
      console.log(errorMessage); // Alert user to check in first
      setMessage(errorMessage); // Set error message to display
      setVisible(true); // Show the error message
    }
  };

  // Effect to handle fade-out after 10 seconds
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false); // Hide the message after 10 seconds
        setMessage(""); // Clear the message
      }, 10000); // 10 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount or when visible changes
    }
  }, [visible]);

  return (
    <div>
      <Breadcrumb />

      {/* Center container */}
      <div className="flex items-center justify-center mt-40">
        <div className="flex flex-col items-center space-y-4">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-800">
            CHECK IN AND CHECKOUT HERE
          </h1>

          {/* Buttons */}
          <button
            onClick={handleCheckIn} // Add onClick for Check-In
            className="bg-blue-500 text-white rounded-sm p-2 w-60"
          >
            Check-In
          </button>
          <button
            onClick={handleCheckOut} // Add onClick for Check-Out
            className="bg-blue-500 text-white rounded-sm p-2 w-60"
          >
            Check-Out
          </button>

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
      </div>
    </div>
  );
}
