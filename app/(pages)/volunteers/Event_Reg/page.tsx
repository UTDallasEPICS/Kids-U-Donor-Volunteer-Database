"use client";
import { useSearchParams } from "next/navigation";
import RegistrationQuestions from "../Registration/registration_form/RegistrationQuestions";
import { useEffect, useState } from "react";
import { Event } from "@/app/types/event";

export default function EventRegPage() {
  const searchParams = useSearchParams();
  const eventID = searchParams.get('eventID');
  const VOLUNTEER_ID = "72ac21c4-2f07-4e64-a2a3-bb643308dec4"; 

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
        const response = await fetch(`/api/events/${eventID}/get`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch event");
        }
        const data = await response.json();
        setEvent(data);
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
            volunteerId={VOLUNTEER_ID}
          />
        </div>
      </div>
    </div>
  );
}
