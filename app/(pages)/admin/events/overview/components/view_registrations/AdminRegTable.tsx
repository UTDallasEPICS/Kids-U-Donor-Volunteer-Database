"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";

interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
}

interface EventRegistration {
  id: string;
  eventGroup: string;
  date: Date;
  referrelSource: string;
  reasonForVolunteering: string;
  volunteer: Volunteer;
}

interface Event {
  id: string;
  name: string;
  schedule: Date;
  description: string;
  locationId: string | null;
  location?: {
    name: string;
    address: string;
    city: string;
    state: string;
  };
  bgCheckRequired: boolean;
  eventRegistrations: EventRegistration[];
}

export const AdminRegTable = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events/get");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching events");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (eventId: string) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  if (loading) {
    return <div className="text-center p-4 text-gray-600">Loading events...</div>;
  }

  if (error) {
    return <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-3 p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-[#2f4b7c]">Events and Registrations</h2>
        <Link
          href="/admin/events"
          className="bg-[#2f4b7c] hover:bg-[#4a6fa5] text-white font-semibold py-2.5 px-5 rounded-xl"
        >
          Add New Event
        </Link>
      </div>

      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Date</th>
            <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Time</th>
            <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Location</th>
            <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">Registrations</th>
            <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
              Background Check Required
            </th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <React.Fragment key={event.id}>
              <tr onClick={() => handleRowClick(event.id)} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 border-b text-sm text-gray-700 font-semibold">{event.name}</td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {format(new Date(event.schedule), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {format(new Date(event.schedule), "h:mm a")}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {event.location ? `${event.location.name}, ${event.location.city}` : "No location set"}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {event.eventRegistrations.length} volunteers
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {event.bgCheckRequired ? "Yes" : "No"}
                </td>
              </tr>
              {expandedEventId === event.id && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 bg-gray-50">
                    <div className="border border-gray-200 rounded-xl p-4 bg-white">
                      <h3 className="font-semibold mb-3 text-[#2f4b7c]">Registered Volunteers</h3>
                      {event.eventRegistrations.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Phone</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Group</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                  Registration Date
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {event.eventRegistrations.map((registration) => (
                                <tr key={registration.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 text-sm text-gray-700">
                                    {registration.volunteer.firstName} {registration.volunteer.lastName}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-700">
                                    {registration.volunteer.emailAddress}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-700">
                                    {registration.volunteer.phoneNumber || "N/A"}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-700">{registration.eventGroup}</td>
                                  <td className="px-4 py-2 text-sm text-gray-700">
                                    {format(new Date(registration.date), "MMM dd, yyyy")}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500">No volunteers registered for this event yet.</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
