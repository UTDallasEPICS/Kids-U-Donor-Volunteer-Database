"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  emailAddress: string;
  hours: string;
}

export default function AddEvent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  
  // Event Form State
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    time: "",
    description: "",
    locationId: ""
  });

  // Location Form State
  const [locationData, setLocationData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    emailAddress: "",
    hours: ""
  });

  useEffect(() => {
    // Fetch locations when component mounts
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations/get');
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        setLocations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching locations');
      }
    };

    fetchLocations();
  }, []);

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/locations/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        throw new Error("Failed to create location");
      }

      const data = await response.json();
      setLocations(prev => [...prev, data]);
      setEventData(prev => ({
        ...prev,
        locationId: data.id
      }));
      setShowLocationForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create location");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/events/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: eventData.name,
          description: eventData.description,
          schedule: new Date(eventData.date + "T" + eventData.time).toISOString(),
          locationId: eventData.locationId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to create event");
      }

      const data = await response.json();
      router.push("/volunteers/Registration?success=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event. Please try again.");
      console.error("Event creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
        <Link href="/" className="hover:text-blue-500 cursor-pointer">Home</Link>
        <span className="text-gray-400">/</span>
        <Link href="/volunteers/Registration" className="hover:text-blue-500">Registration</Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700">Add Event</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Event</h1>

      <div className="max-w-2xl space-y-8">
        <form onSubmit={handleEventSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={eventData.name}
                onChange={handleEventChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={eventData.date}
                  onChange={handleEventChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  required
                  value={eventData.time}
                  onChange={handleEventChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                required
                value={eventData.description}
                onChange={handleEventChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="locationId" className="block text-sm font-medium text-gray-700">Location</label>
              <div className="mt-1 flex items-center gap-4">
                <select
                  id="locationId"
                  name="locationId"
                  required
                  value={eventData.locationId}
                  onChange={handleEventChange}
                  className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select a location</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name} - {location.address}, {location.city}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowLocationForm(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  + New Location
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !eventData.locationId}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </button>
        </form>

        {error && (
          <div className="text-red-600 text-sm mt-2">
            {error}
          </div>
        )}

        {showLocationForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Add New Location</h2>
              <form onSubmit={handleLocationSubmit} className="space-y-4">
                <div>
                  <label htmlFor="locName" className="block text-sm font-medium text-gray-700">Location Name</label>
                  <input
                    type="text"
                    id="locName"
                    name="name"
                    required
                    value={locationData.name}
                    onChange={handleLocationChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={locationData.address}
                    onChange={handleLocationChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={locationData.city}
                      onChange={handleLocationChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                    <select
                      id="state"
                      name="state"
                      required
                      value={locationData.state}
                      onChange={handleLocationChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    >
                      <option value="">Select State</option>
                      <option value="TX">Texas</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      required
                      value={locationData.zipCode}
                      onChange={handleLocationChange}
                      pattern="[0-9]{5}"
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      value={locationData.phoneNumber}
                      onChange={handleLocationChange}
                      pattern="[0-9]{10}"
                      placeholder="1234567890"
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    required
                    value={locationData.emailAddress}
                    onChange={handleLocationChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  />
                </div>

                <div>
                  <label htmlFor="hours" className="block text-sm font-medium text-gray-700">Operating Hours</label>
                  <input
                    type="text"
                    id="hours"
                    name="hours"
                    required
                    value={locationData.hours}
                    onChange={handleLocationChange}
                    placeholder="e.g., Mon-Fri 9:00 AM - 5:00 PM"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowLocationForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                  >
                    {isSubmitting ? "Adding..." : "Add Location"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}