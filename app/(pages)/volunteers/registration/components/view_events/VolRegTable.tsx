"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Event {
  id: string;
  name: string;
  schedule: string;
  description: string;
  bgCheckRequired: boolean;
  location: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  } | null;
}

export const VolRegTable = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, authRes] = await Promise.all([
          fetch("/api/events/get"),
          fetch("/api/auth/me"),
        ]);

        const eventsData = await eventsRes.json();
        setEvents(eventsData);

        if (authRes.ok) {
          const authData = await authRes.json();
          const volunteerId = authData.user?.volunteerId;
          if (volunteerId) {
            const regRes = await fetch(`/api/volunteer/events/registered?volunteerId=${volunteerId}`);
            if (regRes.ok) {
              const regData = await regRes.json();
              setRegisteredEventIds(new Set(regData.map((e: { id: string }) => e.id)));
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewEvent = (id: string) => {
    router.push(`/volunteers/registration/event_registration?eventID=${id}`);
  };

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
        <div className="text-red-500 font-semibold">Error loading events: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2f4b7c] mb-1">Register for Events</h1>
          <p className="text-gray-600 text-sm">Browse upcoming events and sign up to volunteer</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#2f4b7c]">Available Events</h2>
              <p className="text-sm text-gray-500 mt-1">Select an event to register</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Event count */}
              <div className="flex items-center gap-2 bg-[#2f4b7c]/10 px-4 py-2 rounded-full">
                <svg className="w-4 h-4 text-[#2f4b7c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-bold text-[#2f4b7c]">
                  {events.length} event{events.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => {
                const date = new Date(event.schedule);
                const month = date.toLocaleDateString("en-US", { month: "short" });
                const day = date.getDate();
                const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                const fullDate = date.toLocaleDateString("en-US");
                const locationStr = event.location
                  ? `${event.location.name} — ${event.location.city}, ${event.location.state}`
                  : "No location available";

                return (
                  <div
                    key={event.id}
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
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-bold text-gray-900 text-lg group-hover:text-[#2f4b7c] transition-colors">
                            {event.name}
                          </h4>
                          {registeredEventIds.has(event.id) && (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clipRule="evenodd" />
                              </svg>
                              Registered
                            </span>
                          )}
                          {event.bgCheckRequired && (
                            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              BG Check Required
                            </span>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{locationStr}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{fullDate} at {time}</span>
                          </div>
                          {event.description && (
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
                              </svg>
                              <span className="line-clamp-2">{event.description}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Register Button */}
                      <button
                        onClick={() => handleViewEvent(event.id)}
                        className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#2f4b7c] to-[#4a6fa5] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Register
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Events Available</h3>
              <p className="text-sm text-gray-600 max-w-md leading-relaxed">
                There are no upcoming events to register for right now. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
