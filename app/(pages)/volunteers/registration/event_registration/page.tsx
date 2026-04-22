"use client";
import { useSearchParams } from "next/navigation";
import RegistrationQuestions from "./registration_form/RegistrationQuestions";
import { useEffect, useState } from "react";
import { Event } from "@/app/types/event";

export default function EventRegPage() {
  const searchParams = useSearchParams();
  const eventID = searchParams.get('eventID') ?? "";
  const [volunteerId, setVolunteerId] = useState<string>("");
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bgCheckApproved, setBgCheckApproved] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventID) {
        setError("No event ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const [authResponse, bgCheckResponse, eventResponse] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/background-check/get'),
          fetch(`/api/events/${eventID}/get`),
        ]);

        if (!authResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await authResponse.json();
        setVolunteerId(userData.user.volunteerId);

        const bgData = await bgCheckResponse.json();
        setBgCheckApproved(bgData.submitted && bgData.record?.status === "APPROVED");

        if (!eventResponse.ok) throw new Error("Failed to fetch event");
        const eventData = await eventResponse.json();
        if (!eventData) throw new Error("Event not found");
        setEvent(eventData);
      } catch (error) {
        console.error("Error fetching event:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch event");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventID]);

  if (isLoading) return <div className="p-5">Loading...</div>;
  if (error) return <div className="p-5 text-red-500">Error: {error}</div>;
  if (!event) return <div className="p-5">Event not found</div>;

  return (
    <div>
      <div className="p-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{event.name}</h1>
        <div className="space-y-2 mb-6">
          <p>
            <strong>Location:</strong> {event.location?.name || "No location set"}
            {event.location && (
              <span className="ml-2 text-gray-600">
                ({event.location.address}, {event.location.city}, {event.location.state} {event.location.zipCode})
              </span>
            )}
          </p>
          <p>
            <strong>Date:</strong> {
              event.schedule ? new Date(event.schedule).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : "No date set"
            }
          </p>
          <p>
            <strong>Time:</strong> {
              event.schedule ? new Date(event.schedule).toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              }) : "No time set"
            }
          </p>
          <p>
            <strong>Description:</strong> {event.description}
          </p>
        </div>
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Registration Form</h2>
          {event.bgCheckRequired && !bgCheckApproved ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-red-700">Background Check Required</p>
                <p className="text-red-600 text-sm mt-1">
                  You need to be background checked to register for this event.{" "}
                  <a href="/volunteers/apply/background-check" className="underline font-medium">Submit your background check here.</a>
                </p>
              </div>
            </div>
          ) : (
            <RegistrationQuestions
              eventId={eventID}
              volunteerId={volunteerId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
