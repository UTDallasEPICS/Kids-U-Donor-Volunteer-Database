"use client"; 

import { useState, useEffect } from "react";
interface volunteer {}

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const volunteerId = "8bf18571-0f32-4a6a-a71b-e267e650dcc2"; // Hardcoded volunteer ID add your own ID

  // Manual entry state for Column 2
  const [manualCheckInDate, setManualCheckInDate] = useState<string>("");
  const [manualCheckInTime, setManualCheckInTime] = useState<string>("");
  const [manualCheckOutDate, setManualCheckOutDate] = useState<string>("");
  const [manualCheckOutTime, setManualCheckOutTime] = useState<string>("");

  const showMessage = (msg: string, isError: boolean = false) => {
    setMessage(msg);
    setVisible(true);
    if (isError) console.error(msg);
    else console.log(msg);
  };

  const calculateHoursWorked = (checkIn: Date, checkOut: Date) => {
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    return {
      hoursWorked: hours,
      displayHours: hours,
      displayMinutes: minutes,
    };
  };

  // Fetch current event on component mount
  useEffect(() => {
    const fetchCurrentEvent = async () => {
      try {
        const response = await fetch('/api/events/get');
        if (response.ok) {
          const events = await response.json();
          // Get the most recent event (assuming events are ordered by schedule desc)
          const latestEvent = events[0];
          if (latestEvent) {
            setCurrentEvent(latestEvent);
          }
        }
      } catch (error) {
        showMessage("Failed to fetch current event", true);
      }
    };

    fetchCurrentEvent();
  }, []);

  // Handle automatic Check-In
  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    const checkInMessage = `Check-In Time: ${now.toLocaleTimeString()}`;
    showMessage(checkInMessage);
  };

  // Handle automatic Check-Out
  const handleCheckOut = async () => {
    if (isSubmitting || !checkInTime) {
      showMessage("Please check in first.", true);
      return;
    }

    if (!currentEvent) {
      showMessage("No active event found. Please try again.", true);
      return;
    }

    setIsSubmitting(true);
    const now = new Date();
    const { hoursWorked, displayHours, displayMinutes } = calculateHoursWorked(checkInTime, now);

    try {
      const response = await fetch('/api/volunteer/attendance/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hoursWorked,
          checkInTime: checkInTime.toISOString(),
          checkOutTime: now.toISOString(),
          eventId: currentEvent.id,
          volunteerId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        showMessage(`API Error: ${errorData.details || errorData.error}`, true);
      } else {
        const successData = await response.json();
        showMessage(`Check-Out Time: ${now.toLocaleTimeString()}\nHours Volunteered: ${displayHours} hours and ${displayMinutes} minutes`);
        setCheckInTime(null);
      }
    } catch (err) {
      showMessage(`Fetch Error: ${err}`, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle manual hours calculation
  const handleManualHours = async () => {
    if (isSubmitting) return;

    if (!manualCheckInDate || !manualCheckInTime || !manualCheckOutDate || !manualCheckOutTime) {
      showMessage("Please fill in all date and time fields.", true);
      return;
    }

    if (!currentEvent) {
      showMessage("No active event found. Please try again.", true);
      return;
    }

    const checkIn = new Date(`${manualCheckInDate}T${manualCheckInTime}`);
    const checkOut = new Date(`${manualCheckOutDate}T${manualCheckOutTime}`);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      showMessage("Invalid date or time format.", true);
      return;
    }

    if (checkIn >= checkOut) {
      showMessage("Check-out time must be after check-in time.", true);
      return;
    }

    setIsSubmitting(true);
    const { hoursWorked, displayHours, displayMinutes } = calculateHoursWorked(checkIn, checkOut);

    try {
      const response = await fetch('/api/volunteer/attendance/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hoursWorked,
          checkInTime: checkIn.toISOString(),
          checkOutTime: checkOut.toISOString(),
          eventId: currentEvent.id,
          volunteerId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        showMessage(`API Error: ${errorData.details || errorData.error}`, true);
      } else {
        const successData = await response.json();
        showMessage(`Hours Volunteered: ${displayHours} hours and ${displayMinutes} minutes`);
      }
    } catch (err) {
      showMessage(`Fetch Error: ${err}`, true);
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-2xl font-semibold text-gray-800">Button Entry</h1>
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
          className={`mt-4 p-4 border rounded-lg bg-green-100 text-green-700 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"
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