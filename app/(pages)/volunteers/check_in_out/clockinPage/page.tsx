"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
interface volunteer {}

const Breadcrumb = () => (
  <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
    <Link href="/volunteers/check_in_out" className="hover:text-[#2f4b7c] cursor-pointer transition-colors duration-200 text-[#4a6fa5]">
      Home
    </Link>
    <span className="text-gray-400">/</span>
    <span className="font-semibold text-gray-700">Check In / Check Out</span>
  </div>
);

export default function Checkinout() {
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [volunteerId, setVolunteerId] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  // Manual entry state for Column 2
  const [manualCheckInDate, setManualCheckInDate] = useState<string>("");
  const [manualCheckInTime, setManualCheckInTime] = useState<string>("");
  const [manualCheckOutDate, setManualCheckOutDate] = useState<string>("");
  const [manualCheckOutTime, setManualCheckOutTime] = useState<string>("");

  const showMessage = (msg: string, error: boolean = false) => {
    setMessage(msg);
    setIsError(error);
    setVisible(true);
    if (error) console.error(msg);
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

  // Fetch current user's volunteer ID and current event on component mount
  useEffect(() => {
    const fetchUserAndEvent = async () => {
      try {
        // Get volunteer ID directly from /api/auth/me
        const userResponse = await fetch('/api/auth/me');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.success && userData.user?.volunteerId) {
            setVolunteerId(userData.user.volunteerId);
          } else {
            showMessage("No volunteer profile found for your account.", true);
          }
        }
        setIsLoadingUser(false);

        // Fetch current event
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
        showMessage("Failed to fetch user or event data", true);
        setIsLoadingUser(false);
      }
    };

    fetchUserAndEvent();
  }, []);

  // Handle automatic Check-In
  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    showMessage(`Checked in at ${now.toLocaleTimeString()}`);
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

    if (!volunteerId) {
      showMessage("No volunteer profile found. Please contact support.", true);
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
        showMessage(`Checked out at ${now.toLocaleTimeString()} — ${displayHours}h ${displayMinutes}m volunteered`);
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

    if (!volunteerId) {
      showMessage("No volunteer profile found. Please contact support.", true);
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
        showMessage(`Hours logged: ${displayHours}h ${displayMinutes}m`);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <Breadcrumb />
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2f4b7c] mb-1">Check In / Check Out</h1>
            <p className="text-gray-600 text-sm">Record your volunteer hours for today&apos;s event</p>
          </div>
          {currentEvent && (
            <div className="flex items-center gap-2 bg-[#2f4b7c]/10 px-4 py-2 rounded-full">
              <svg className="w-4 h-4 text-[#2f4b7c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-bold text-[#2f4b7c]">{currentEvent.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Notification */}
      {message && (
        <div
          className={`mb-6 max-w-4xl mx-auto flex items-start gap-3 p-4 rounded-xl border transition-opacity duration-500 ${
            visible ? "opacity-100" : "opacity-0"
          } ${
            isError
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
        >
          {isError ? (
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <div>
            {message.split("\n").map((msg, index) => (
              <p key={index} className="text-sm font-medium">{msg}</p>
            ))}
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

        {/* Button Entry Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          {/* Card Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-[#2f4b7c] to-[#4a6fa5] rounded-xl shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quick Entry</h2>
              <p className="text-xs text-gray-500 mt-0.5">One-tap check in and out</p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className={`flex items-center gap-2 mb-6 px-4 py-3 rounded-xl ${checkInTime ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50 border border-gray-200"}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${checkInTime ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}></div>
            <span className={`text-sm font-semibold ${checkInTime ? "text-emerald-700" : "text-gray-500"}`}>
              {checkInTime ? `Checked in at ${checkInTime.toLocaleTimeString()}` : "Not checked in"}
            </span>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCheckIn}
              disabled={!!checkInTime}
              className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-[#2f4b7c] to-[#4a6fa5] text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Check In
            </button>

            <button
              onClick={handleCheckOut}
              disabled={!checkInTime || isSubmitting}
              className="w-full flex items-center justify-center gap-3 p-4 bg-white border-2 border-[#2f4b7c] text-[#2f4b7c] rounded-xl hover:bg-[#2f4b7c] hover:text-white hover:scale-[1.02] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-[#2f4b7c]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {isSubmitting ? "Saving..." : "Check Out"}
            </button>
          </div>
        </div>

        {/* Manual Entry Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          {/* Card Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-[#4a6fa5] to-[#668dc4] rounded-xl shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Manual Entry</h2>
              <p className="text-xs text-gray-500 mt-0.5">Enter times manually</p>
            </div>
          </div>

          {/* Check-In Row */}
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Check-In</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Date</label>
                <input
                  type="date"
                  value={manualCheckInDate}
                  onChange={(e) => setManualCheckInDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f4b7c] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Time</label>
                <input
                  type="time"
                  value={manualCheckInTime}
                  onChange={(e) => setManualCheckInTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f4b7c] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Check-Out Row */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Check-Out</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Date</label>
                <input
                  type="date"
                  value={manualCheckOutDate}
                  onChange={(e) => setManualCheckOutDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f4b7c] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Time</label>
                <input
                  type="time"
                  value={manualCheckOutTime}
                  onChange={(e) => setManualCheckOutTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f4b7c] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleManualHours}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-[#2f4b7c] to-[#4a6fa5] text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isSubmitting ? "Saving..." : "Log Hours"}
          </button>
        </div>
      </div>
    </div>
  );
}
