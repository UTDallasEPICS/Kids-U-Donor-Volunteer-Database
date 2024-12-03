"use client";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Simulate fetching event data dynamically based on slug
  const eventData = {
    "event-1": {
      name: "Event 1",
      location: "Location 1",
      date: "Date 1",
      description: "Description of Event 1",
    },
    "event-2": {
      name: "Event 2",
      location: "Location 2",
      date: "Date 2",
      description: "Description of Event 2",
    },
  };

  // Retrieve event details using slug
  const event = eventData[id];

  if (!event) {
    return <div>Event not found!</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-gray-800">{event.name}</h1>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Date:</strong> {event.date}
      </p>
      <p>
        <strong>Description:</strong> {event.description}
      </p>
    </div>
  );
}
