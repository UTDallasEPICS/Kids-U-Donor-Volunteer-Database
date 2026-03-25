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

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventID) {
        setError("No event ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const authResponse = await fetch('/api/auth/me');
        if (!authResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await authResponse.json();
        const id = userData.user.volunteerId;
        setVolunteerId(id);

        const response = await fetch(`/api/events/${eventID}/get`);
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        const eventData = await response.json();
        if (!eventData) {
          throw new Error("Event not found");
        }
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
          <RegistrationQuestions 
            eventId={eventID}
            volunteerId={volunteerId}
          />
        </div>
      </div>
    </div>
  );
}
