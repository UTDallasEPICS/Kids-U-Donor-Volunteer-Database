"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface EventItem {
  id: string;
  name: string;
  schedule: string;
  location: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  } | null;
}

export default function BasicTable() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Get the volunteer ID directly from /api/auth/me
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        const volunteerId = meData?.user?.volunteerId;
        if (!volunteerId) {
          setError("No volunteer profile found");
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/volunteer/events/registered?volunteerId=${volunteerId}`);
        const data = await res.json();
        setItems(data);
        setLoading(false);
      } catch {
        setError("Failed to load events");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-[#2f4b7c] font-semibold text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-red-500 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2f4b7c] mb-1">Check In / Check Out</h1>
          <p className="text-gray-600 text-sm">Select a registered event to clock in or out</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#2f4b7c]">Registered Events</h2>
              <p className="text-sm text-gray-500 mt-1">Events you have signed up for</p>
            </div>
            <div className="flex items-center gap-2 bg-[#2f4b7c]/10 px-4 py-2 rounded-full">
              <svg className="w-4 h-4 text-[#2f4b7c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-bold text-[#2f4b7c]">
                {items.length} event{items.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item) => {
                const date = new Date(item.schedule);
                const month = date.toLocaleDateString("en-US", { month: "short" });
                const day = date.getDate();
                const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                const fullDate = date.toLocaleDateString("en-US");
                const locationStr = item.location
                  ? `${item.location.address ?? "N/A"}, ${item.location.city ?? "N/A"} ${item.location.state ?? "N/A"}, ${item.location.zipCode ?? "N/A"}`
                  : "No location available";

                return (
                  <div
                    key={item.id}
                    className="group bg-gradient-to-r from-slate-50 to-white rounded-xl p-5 border-2 border-gray-100 hover:border-[#4a6fa5] hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-5">
                      {/* Date Badge */}
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#2f4b7c] to-[#4a6fa5] rounded-2xl flex flex-col items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                        <span className="text-xs font-bold uppercase tracking-wide">{month}</span>
                        <span className="text-2xl font-bold leading-none">{day}</span>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-[#2f4b7c] transition-colors">
                          {item.name}
                        </h4>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="truncate">{locationStr}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>
                              {fullDate} at {time}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Clock-in Button */}
                      <button
                        onClick={() => router.push(`/volunteers/check_in_out/clockinPage?eventId=${item.id}`)}
                        className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#2f4b7c] to-[#4a6fa5] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Clock In / Out
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-28 h-28 bg-gradient-to-br from-[#2f4b7c]/10 to-[#4a6fa5]/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-14 h-14 text-[#2f4b7c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Registered Events</h3>
              <p className="text-sm text-gray-600 mb-6 max-w-md leading-relaxed">
                You have not registered for any events yet. Browse available events and sign up to get started!
              </p>
              <button
                onClick={() => (window.location.href = "/volunteers/registration")}
                className="px-8 py-3 bg-gradient-to-r from-[#2f4b7c] to-[#4a6fa5] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
              >
                Browse All Events
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
