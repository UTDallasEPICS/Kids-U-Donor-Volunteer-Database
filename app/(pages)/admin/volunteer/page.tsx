"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

type ExistingSlot = {
  id: string;
  startTime: string;
  endTime: string;
};

type NewSlot = {
  startTime: string;
  endTime: string;
};

const TIME_OPTIONS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  registration: boolean;
  dateSubmitted: string;
  orientationInvitation?: {
    id: string;
    status: "DRAFT" | "SENT" | "CONFIRMED" | "EXPIRED";
    firstEmailSentAt: string | null;
  } | null;
}

const headCells = [
  { id: "name", numeric: false, label: "Name" },
  { id: "email", numeric: false, label: "Email" },
  { id: "joined", numeric: false, label: "Joined" },
  { id: "registration", numeric: false, label: "Registration Status" },
  { id: "orientation", numeric: false, label: "Orientation" },
  { id: "actions", numeric: false, label: "Actions" },
];

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scheduleTarget, setScheduleTarget] = useState<Volunteer | null>(null);
  const [meetingLink, setMeetingLink] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [newSlots, setNewSlots] = useState<NewSlot[]>([]);
  const [existingSlots, setExistingSlots] = useState<ExistingSlot[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>("");
  const [modalSuccess, setModalSuccess] = useState<string>("");

  const router = useRouter();

  const fetchVolunteersData = async () => {
    try {
      const response = await fetch("/api/volunteer/get", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || "Something went wrong";
        throw new Error(message);
      }

      const result = await response.json();
      setVolunteers(result.volunteers);
      setIsLoading(false);
    } catch (error) {
      router.push("/not-found");
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    fetchVolunteersData();
  }, []);

  useEffect(() => {
    const loadInvitation = async () => {
      if (!scheduleTarget) return;

      setIsModalLoading(true);
      setModalError("");
      setModalSuccess("");
      setNewSlots([]);
      setExistingSlots([]);
      setSelectedDate("");

      try {
        const response = await fetch(
          `/api/admin/orientation/schedule?volunteerId=${scheduleTarget.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load orientation schedule");
        }

        const data = await response.json();
        const invitation = data?.invitation;

        setMeetingLink(invitation?.meetingLink ?? "");
        setExistingSlots(
          Array.isArray(invitation?.slots)
            ? invitation.slots.map((slot: ExistingSlot) => ({
                id: slot.id,
                startTime: slot.startTime,
                endTime: slot.endTime,
              }))
            : []
        );
      } catch (error) {
        setModalError(error instanceof Error ? error.message : "Failed to load schedule");
      } finally {
        setIsModalLoading(false);
      }
    };

    loadInvitation();
  }, [scheduleTarget]);

  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Volunteers</span>
    </div>
  );

  if (isLoading) {
    return <Loading />;
  }

  const isNewVolunteer = (dateSubmitted: string) => {
    const submitted = new Date(dateSubmitted).getTime();
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    return now - submitted <= sevenDaysMs;
  };

  const formatSlotLabel = (iso: string) => {
    const date = new Date(iso);
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  };

  const buildDateOptions = () => {
    const options: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 14; i++) {
      const next = new Date(today);
      next.setDate(today.getDate() + i);
      options.push(next);
    }

    return options;
  };

  const toISODate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const addTimeSlot = (timeValue: string) => {
    if (!selectedDate) {
      setModalError("Choose a date first");
      return;
    }

    setModalError("");

    const [hours, minutes] = timeValue.split(":").map(Number);
    const start = new Date(`${selectedDate}T00:00:00`);
    start.setHours(hours, minutes, 0, 0);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const slot: NewSlot = {
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };

    const existsInExisting = existingSlots.some((s) => s.startTime === slot.startTime);
    const existsInNew = newSlots.some((s) => s.startTime === slot.startTime);

    if (existsInExisting || existsInNew) {
      return;
    }

    setNewSlots((prev) => [...prev, slot]);
  };

  const removeNewSlot = (startTime: string) => {
    setNewSlots((prev) => prev.filter((slot) => slot.startTime !== startTime));
  };

  const handleSaveSchedule = async () => {
    if (!scheduleTarget) return;

    if (!meetingLink.trim()) {
      setModalError("Meeting link is required");
      return;
    }

    if (newSlots.length === 0) {
      setModalError("Select at least one new time slot");
      return;
    }

    setModalError("");
    setModalSuccess("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/orientation/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          volunteerId: scheduleTarget.id,
          meetingLink,
          slots: newSlots,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to save orientation schedule");
      }

      setModalSuccess(
        result.firstEmailSent
          ? "Schedule saved and first orientation email sent."
          : "New availability slots added."
      );

      setTimeout(() => {
        setScheduleTarget(null);
      }, 900);

      fetchVolunteersData();
    } catch (error) {
      setModalError(error instanceof Error ? error.message : "Failed to save schedule");
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setScheduleTarget(null);
    setMeetingLink("");
    setSelectedDate("");
    setNewSlots([]);
    setExistingSlots([]);
    setModalError("");
    setModalSuccess("");
  };

  return (
    <div className="flex font-sans">
      <div className="flex-grow p-5">
        <Breadcrumb />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Volunteers</h2>
          <Link
            href="/admin/volunteer/application"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Applications
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                {headCells.map((headCell) => (
                  <th
                    key={headCell.id}
                    className="px-6 py-3 border-b text-left font-bold"
                  >
                    {headCell.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                      <Link
                        className="text-blue-500"
                        href={`/admin/volunteer/${volunteer.id}`}
                      >
                        {`${volunteer.firstName} ${volunteer.lastName}`}
                      </Link>
                      {isNewVolunteer(volunteer.dateSubmitted) && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                          New Volunteer
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b">{volunteer.emailAddress}</td>
                  <td className="px-6 py-4 border-b">
                    {new Date(volunteer.dateSubmitted).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {volunteer.registration ? "Registered" : "Not Registered"}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {volunteer.orientationInvitation?.firstEmailSentAt
                      ? "Email sent"
                      : "Not sent"}
                  </td>
                  <td className="px-6 py-4 border-b">
                    <button
                      type="button"
                      onClick={() => setScheduleTarget(volunteer)}
                      className="bg-[#2f4b7c] hover:bg-[#1f3659] text-white text-sm font-semibold py-2 px-3 rounded"
                    >
                      Schedule Orientation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {scheduleTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-2">Schedule Orientation</h3>
              <p className="text-sm text-gray-700 mb-4">
                Starting from this volunteer row: <strong>{scheduleTarget.firstName} {scheduleTarget.lastName}</strong>
              </p>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Meeting Link
                </label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {isModalLoading ? (
                <div className="py-10 text-sm text-gray-600">Loading schedule...</div>
              ) : (
                <>
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Choose day (next 14 days)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                      {buildDateOptions().map((date) => {
                        const isoDate = toISODate(date);
                        const selected = selectedDate === isoDate;
                        return (
                          <button
                            key={isoDate}
                            type="button"
                            onClick={() => setSelectedDate(isoDate)}
                            className={`rounded border px-2 py-2 text-xs font-semibold ${
                              selected
                                ? "bg-[#2f4b7c] text-white border-[#2f4b7c]"
                                : "bg-white text-gray-700 border-gray-300"
                            }`}
                          >
                            {date.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-5">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Click time slots to add (30-min sessions)
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {TIME_OPTIONS.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => addTimeSlot(time)}
                          className="rounded border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-5">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Existing slots</p>
                      <div className="max-h-40 overflow-y-auto rounded border border-gray-200 p-2">
                        {existingSlots.length === 0 ? (
                          <p className="text-xs text-gray-500">No existing slots yet.</p>
                        ) : (
                          <ul className="space-y-1">
                            {existingSlots.map((slot) => (
                              <li key={slot.id} className="text-xs text-gray-700">
                                {formatSlotLabel(slot.startTime)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">New slots to add</p>
                      <div className="max-h-40 overflow-y-auto rounded border border-gray-200 p-2">
                        {newSlots.length === 0 ? (
                          <p className="text-xs text-gray-500">No new slots selected.</p>
                        ) : (
                          <ul className="space-y-1">
                            {newSlots.map((slot) => (
                              <li
                                key={slot.startTime}
                                className="flex items-center justify-between gap-2 text-xs text-gray-700"
                              >
                                <span>{formatSlotLabel(slot.startTime)}</span>
                                <button
                                  type="button"
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => removeNewSlot(slot.startTime)}
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {modalError && (
                <p className="text-sm text-red-600 mb-3">{modalError}</p>
              )}
              {modalSuccess && (
                <p className="text-sm text-green-700 mb-3">{modalSuccess}</p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={isSaving || isModalLoading}
                  className="bg-[#2f4b7c] hover:bg-[#1f3659] disabled:bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={handleSaveSchedule}
                >
                  {isSaving ? "Saving..." : "Save & Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
