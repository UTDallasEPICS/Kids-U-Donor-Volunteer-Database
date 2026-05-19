"use client";

import { useEffect, useState } from "react";

type OrientationSchedule = {
  id: string;
  meetingLink: string;
  confirmedAt: string | null;
  status: "CONFIRMED" | "SENT" | "DRAFT" | "EXPIRED";
  volunteer: {
    firstName: string;
    lastName: string;
    emailAddress: string;
  };
  confirmedAdminUser: {
    email: string;
    person: {
      firstName: string;
      lastName: string;
    } | null;
  } | null;
  selectedSlot: {
    id: string;
    startTime: string;
    endTime: string;
    adminUser: {
      email: string;
      person: {
        firstName: string;
        lastName: string;
      } | null;
    };
  } | null;
  slots: Array<{
    id: string;
    startTime: string;
    endTime: string;
  }>;
};

export default function OrientationList() {
  const [items, setItems] = useState<OrientationSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [editing, setEditing] = useState<OrientationSchedule | null>(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/orientation/confirmed");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load orientations");
      }
      setItems(Array.isArray(data.schedules) ? data.schedules : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orientations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const getAdminName = (item: OrientationSchedule) => {
    const slotAdmin = item.selectedSlot?.adminUser;
    if (slotAdmin?.person?.firstName || slotAdmin?.person?.lastName) {
      return `${slotAdmin.person?.firstName || ""} ${slotAdmin.person?.lastName || ""}`.trim();
    }
    if (item.confirmedAdminUser?.person?.firstName || item.confirmedAdminUser?.person?.lastName) {
      return `${item.confirmedAdminUser?.person?.firstName || ""} ${item.confirmedAdminUser?.person?.lastName || ""}`.trim();
    }
    return slotAdmin?.email || item.confirmedAdminUser?.email || "Admin";
  };

  const openEdit = (item: OrientationSchedule) => {
    setEditing(item);
    setMeetingLink(item.meetingLink || "");
    setSelectedSlotId(item.selectedSlot?.id || "");
  };

  const closeEdit = () => {
    setEditing(null);
    setMeetingLink("");
    setSelectedSlotId("");
  };

  const saveEdit = async () => {
    if (!editing) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/orientation/confirmed/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingLink, selectedSlotId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update orientation");
      }
      await fetchData();
      closeEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update orientation");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/orientation/confirmed/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete orientation");
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete orientation");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) return <p className="text-sm text-gray-600">Loading...</p>;

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
          No confirmed orientations yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Volunteer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Admin Host</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Scheduled</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Meeting Link</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b text-sm text-gray-800">
                    <div className="font-semibold text-[#2f4b7c]">
                      {item.volunteer.firstName} {item.volunteer.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{item.volunteer.emailAddress}</div>
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    {getAdminName(item)}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">
                    {item.selectedSlot?.startTime ? formatDateTime(item.selectedSlot.startTime) : "—"}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-blue-700 break-all">
                    {item.meetingLink || "—"}
                  </td>
                  <td className="px-6 py-4 border-b text-sm">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="rounded-lg border border-[#2f4b7c] px-3 py-1.5 text-[#2f4b7c] font-semibold hover:bg-[#2f4b7c] hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting === item.id}
                        className="rounded-lg border border-red-500 px-3 py-1.5 text-red-600 font-semibold hover:bg-red-600 hover:text-white disabled:opacity-60"
                      >
                        {isDeleting === item.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2f4b7c]">Edit Orientation</h3>
              <button onClick={closeEdit} className="text-gray-400 hover:text-gray-600">×</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Meeting Link</label>
                <input
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#2f4b7c] focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Scheduled Slot</label>
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#2f4b7c] focus:outline-none"
                >
                  <option value="">Select a slot</option>
                  {editing.slots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {formatDateTime(slot.startTime)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEdit}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={isSaving}
                className="rounded-xl bg-[#2f4b7c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a6fa5] disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
