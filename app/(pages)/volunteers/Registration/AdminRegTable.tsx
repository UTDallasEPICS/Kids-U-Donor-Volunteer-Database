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
      const response = await fetch('/api/events/get');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (eventId: string) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  if (loading) {
    return <div className="text-center p-4">Loading events...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Events and Registrations</h2>
        <Link
          href="/volunteers/Registration/add-event"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Event
        </Link>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 border-b text-left">Name</th>
            <th className="px-6 py-3 border-b text-left">Date</th>
            <th className="px-6 py-3 border-b text-left">Time</th>
            <th className="px-6 py-3 border-b text-left">Location</th>
            <th className="px-6 py-3 border-b text-left">Registrations</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <React.Fragment key={event.id}>
              <tr 
                onClick={() => handleRowClick(event.id)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 border-b">{event.name}</td>
                <td className="px-6 py-4 border-b">
                  {format(new Date(event.schedule), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 border-b">
                  {format(new Date(event.schedule), 'h:mm a')}
                </td>
                <td className="px-6 py-4 border-b">
                  {event.location ? `${event.location.name}, ${event.location.city}` : 'No location set'}
                </td>
                <td className="px-6 py-4 border-b">
                  {event.eventRegistrations.length} volunteers
                </td>
              </tr>
              {expandedEventId === event.id && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 bg-gray-50">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Registered Volunteers</h3>
                      {event.eventRegistrations.length > 0 ? (
                        <table className="min-w-full">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-4 py-2 text-left">Name</th>
                              <th className="px-4 py-2 text-left">Email</th>
                              <th className="px-4 py-2 text-left">Phone</th>
                              <th className="px-4 py-2 text-left">Group</th>
                              <th className="px-4 py-2 text-left">Registration Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {event.eventRegistrations.map((registration) => (
                              <tr key={registration.id} className="hover:bg-gray-100">
                                <td className="px-4 py-2">
                                  {registration.volunteer.firstName} {registration.volunteer.lastName}
                                </td>
                                <td className="px-4 py-2">{registration.volunteer.emailAddress}</td>
                                <td className="px-4 py-2">{registration.volunteer.phoneNumber || 'N/A'}</td>
                                <td className="px-4 py-2">{registration.eventGroup}</td>
                                <td className="px-4 py-2">
                                  {format(new Date(registration.date), 'MMM dd, yyyy')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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