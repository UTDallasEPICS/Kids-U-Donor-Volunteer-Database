"use client";
import RegistrationQuestions from "../RegistrationQuestions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Registration</span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Event Registration</span>
    </div>
  );

  const Header = () => (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-bold text-gray-800">Event Registration</h1>
    </div>
  );

  // Define event data with an index signature

  const eventData: Record<
    string,
    { name: string; location: string; date: string; description: string }
  > = {
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
    return (
      <div className="p-5">
        <div>
          <Breadcrumb />
          <Header />
          <div>
            <h2 className="font-bold text-xl">Event Information</h2>
            <p>Location:</p>
            <p>Date:</p>
            <p>Description:</p>
          </div>
        </div>
        <div>
          <RegistrationQuestions />
        </div>
      </div>
    );
  }

  return (
    <div>
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
      <RegistrationQuestions />
    </div>
  );
}
