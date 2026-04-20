"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { FiCalendar, FiMapPin, FiUsers, FiEdit2, FiTrash2, FiPlus, FiSettings, FiMail, FiPhone, FiX, FiShield } from "react-icons/fi";

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

interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
}

interface EventRegistration {
  id: string;
  volunteer: Volunteer;
}

interface Event {
  id: string;
  name: string;
  description: string;
  schedule: string;
  location: Location | null;
  eventRegistrations: EventRegistration[];
  bgCheckRequired: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [managingEvent, setManagingEvent] = useState<Event | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    locationId: "",
    bgCheckRequired: false,
  });

  const [locationData, setLocationData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    emailAddress: "",
    hours: "",
  });

  useEffect(() => {
    fetchEvents();
    fetchLocations();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events/get");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/locations/get");
      if (!response.ok) throw new Error("Failed to fetch locations");
      const data = await response.json();
      setLocations(data);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
    }
  };

  const handleOpenModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      const scheduleDate = new Date(event.schedule);
      setFormData({
        name: event.name,
        description: event.description,
        date: format(scheduleDate, "yyyy-MM-dd"),
        time: format(scheduleDate, "HH:mm"),
        locationId: event.location?.id || "",
        bgCheckRequired: event.bgCheckRequired,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        name: "",
        description: "",
        date: "",
        time: "",
        locationId: "",
        bgCheckRequired: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const schedule = new Date(formData.date + "T" + formData.time).toISOString();
      const payload = {
        name: formData.name,
        description: formData.description,
        schedule,
        locationId: formData.locationId || null,
        bgCheckRequired: formData.bgCheckRequired,
      };

      const url = editingEvent
        ? `/api/admin/events/${editingEvent.id}/patch`
        : "/api/admin/events/post";

      const response = await fetch(url, {
        method: editingEvent ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to save event");
      }

      await fetchEvents();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This will also remove all registrations."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/events/${eventId}/delete`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete event");
      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
    }
  };

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/locations/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) throw new Error("Failed to create location");

      const newLocation = await response.json();
      setLocations([...locations, newLocation]);
      setFormData({ ...formData, locationId: newLocation.id });
      setShowLocationModal(false);
      setLocationData({
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        emailAddress: "",
        hours: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create location");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Events</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage volunteer events</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-[#4C7AB8] hover:bg-[#4C7AB8]/90 text-white font-medium rounded-lg transition-colors"
          >
            <FiPlus size={20} />
            Create Event
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-2">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}

      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCalendar size={32} className="text-[#4C7AB8]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first event</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4C7AB8] hover:bg-[#4C7AB8]/90 text-white font-medium rounded-lg transition-colors"
          >
            <FiPlus size={20} />
            Create Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden"
            >
              
              <div className="bg-[#4C7AB8] p-5 text-white">
                <h3 className="text-lg font-bold mb-2">{event.name}</h3>
                <p className="text-blue-100 text-sm line-clamp-2">{event.description}</p>
              </div>

              {/* Event Details */}
              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3 text-sm">
                  <FiCalendar className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(new Date(event.schedule), "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-gray-600">
                      {format(new Date(event.schedule), "h:mm a")}
                    </p>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-start gap-3 text-sm">
                    <FiMapPin className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                    <div>
                      <p className="font-medium text-gray-900">{event.location.name}</p>
                      <p className="text-gray-600">
                        {event.location.city}, {event.location.state}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <FiUsers className="text-gray-400 flex-shrink-0" size={18} />
                  <p className="text-gray-700">
                    <span className="font-semibold text-blue-500">
                      {event.eventRegistrations.length}
                    </span>{" "}
                    volunteer{event.eventRegistrations.length !== 1 ? "s" : ""} registered
                  </p>
                </div>

                
                {event.eventRegistrations.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">Recent volunteers:</p>
                    <div className="flex flex-wrap gap-2">
                      {event.eventRegistrations.slice(0, 3).map((reg) => (
                        <div
                          key={reg.id}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {reg.volunteer.firstName} {reg.volunteer.lastName}
                        </div>
                      ))}
                      {event.eventRegistrations.length > 3 && (
                        <div className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{event.eventRegistrations.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <FiShield className={event.bgCheckRequired ? "text-amber-500 flex-shrink-0" : "text-gray-400 flex-shrink-0"} size={18} />
                  <p className={event.bgCheckRequired ? "text-amber-500" : "text-gray-400"}>
                    {event.bgCheckRequired ? "Background check required" : "Background check not required"}
                  </p>
                </div>
              </div>

              
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => {
                    setManagingEvent(event);
                    setShowManageModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#4C7AB8] hover:bg-[#4C7AB8]/90 text-white rounded-lg font-medium transition-colors"
                >
                  <FiSettings size={16} />
                  Manage
                </button>
                <button
                  onClick={() => handleOpenModal(event)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-[#4C7AB8] px-6 py-5 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">
                    {editingEvent ? "Edit Event" : "Create New Event"}
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    {editingEvent ? "Update event details" : "Fill in the details to create a new event"}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter event name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-semibold text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Describe the event..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                />
              </div>

              <div>
                <label htmlFor="locationId" className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <div className="flex gap-3">
                  <select
                    id="locationId"
                    value={formData.locationId}
                    onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  >
                    <option value="">Select a location</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} - {loc.city}, {loc.state}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowLocationModal(true)}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    + New
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.bgCheckRequired}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bgCheckRequired: e.target.checked,
                    })
                  }
                />
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Requires Background Check
                </label>
              </div>
        
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-[#4C7AB8] hover:bg-[#4C7AB8]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full">
      
            <div className="bg-[#4C7AB8] px-6 py-5 text-white rounded-t-3xl">
              <h2 className="text-xl font-bold">Add New Location</h2>
              <p className="text-blue-100 text-sm mt-1">Create a location for your events</p>
            </div>

        
            <form onSubmit={handleLocationSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <label htmlFor="locName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Location Name *
                </label>
                <input
                  type="text"
                  id="locName"
                  value={locationData.name}
                  onChange={(e) => setLocationData({ ...locationData, name: e.target.value })}
                  required
                  placeholder="Enter location name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  value={locationData.address}
                  onChange={(e) => setLocationData({ ...locationData, address: e.target.value })}
                  required
                  placeholder="Street address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={locationData.city}
                    onChange={(e) => setLocationData({ ...locationData, city: e.target.value })}
                    required
                    placeholder="City"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={locationData.state}
                    onChange={(e) => setLocationData({ ...locationData, state: e.target.value })}
                    required
                    placeholder="State"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    value={locationData.zipCode}
                    onChange={(e) => setLocationData({ ...locationData, zipCode: e.target.value })}
                    required
                    placeholder="12345"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={locationData.phoneNumber}
                    onChange={(e) =>
                      setLocationData({ ...locationData, phoneNumber: e.target.value })
                    }
                    required
                    placeholder="(555) 555-5555"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="emailAddress" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  value={locationData.emailAddress}
                  onChange={(e) =>
                    setLocationData({ ...locationData, emailAddress: e.target.value })
                  }
                  required
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div>
                <label htmlFor="hours" className="block text-sm font-semibold text-gray-700 mb-2">
                  Operating Hours *
                </label>
                <input
                  type="text"
                  id="hours"
                  value={locationData.hours}
                  onChange={(e) => setLocationData({ ...locationData, hours: e.target.value })}
                  placeholder="e.g., Mon-Fri 9:00 AM - 5:00 PM"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#4C7AB8] hover:bg-[#4C7AB8]/90 text-white rounded-lg font-medium transition-colors"
                >
                  Add Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showManageModal && managingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-[#4C7AB8] px-6 py-5 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{managingEvent.name}</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    {format(new Date(managingEvent.schedule), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    {managingEvent.location && (
                      <div className="flex items-center gap-2">
                        <FiMapPin size={16} />
                        <span>{managingEvent.location.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FiUsers size={16} />
                      <span>{managingEvent.eventRegistrations.length} volunteers registered</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowManageModal(false);
                    setManagingEvent(null);
                    setSelectedVolunteer(null);
                  }}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {managingEvent.eventRegistrations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUsers size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No volunteers registered yet</h3>
                  <p className="text-gray-600">Volunteers who register for this event will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Registered Volunteers ({managingEvent.eventRegistrations.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {managingEvent.eventRegistrations.map((reg) => (
                      <button
                        key={reg.id}
                        onClick={() => setSelectedVolunteer(reg.volunteer)}
                        className="p-4 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-xl text-left transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {reg.volunteer.firstName} {reg.volunteer.lastName}
                            </p>
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FiMail size={14} className="flex-shrink-0" />
                                <span className="truncate">{reg.volunteer.emailAddress}</span>
                              </div>
                              {reg.volunteer.phoneNumber && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <FiPhone size={14} className="flex-shrink-0" />
                                  <span>{reg.volunteer.phoneNumber}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl max-w-2xl w-full">
            <div className="bg-[#4C7AB8] px-6 py-5 text-white rounded-t-3xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">Volunteer Profile</p>
                </div>
                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiMail size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="text-sm font-medium text-gray-900">{selectedVolunteer.emailAddress}</p>
                      </div>
                    </div>
                    {selectedVolunteer.phoneNumber && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FiPhone size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone Number</p>
                          <p className="text-sm font-medium text-gray-900">{selectedVolunteer.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Volunteer ID</p>
                  <p className="text-sm font-mono text-gray-700 bg-gray-50 px-3 py-2 rounded">{selectedVolunteer.id}</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
