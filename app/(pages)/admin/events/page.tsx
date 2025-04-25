"use client";
import React, { useState, useEffect } from "react";
import { VolRegTable } from "../Registration/VolRegTable";
import Loading from "@/app/loading";

interface DatabaseEvent {
  id: string;
  name: string;
  schedule: string;
  description: string;
  locationId: string | null;
  location?: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface TableEvent {
  ID: number;
  Name: string;
  Date: Date;
  Time: Date;
  Description: string;
  LocationID: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<TableEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events/get");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data: DatabaseEvent[] = await response.json();
        
        // Transform the data to match the expected format
        const formattedEvents: TableEvent[] = data.map((event, index) => {
          const scheduleDate = new Date(event.schedule);
          return {
            ID: parseInt(event.id) || index + 1, // Fallback to index + 1 if id is not numeric
            Name: event.name,
            Date: scheduleDate,
            Time: scheduleDate,
            Description: event.description,
            LocationID: event.locationId ? parseInt(event.locationId) : 0,
          };
        });
        
        setEvents(formattedEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const Header = () => (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-bold text-gray-800">All Events</h1>
    </div>
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading events: {error}</div>;

  return (
    <div className={"flex font-sans"}>
      <div className="flex-grow p-5">
        <Header />
        <VolRegTable data={events} />
      </div>
    </div>
  );
}