"use client";

import React, { useEffect, useState } from "react";

interface VolunteerLog {
  id: string;
  hoursWorked: number;
  checkInTime: string;
  checkOutTime: string;
  volunteer: {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
  };
  event: {
    id: string;
    name: string;
  };
}

interface Summary {
  totalHours: number;
  uniqueVolunteers: number;
  totalSessions: number;
}

export default function VolunteerLogsPage() {
  const [logs, setLogs] = useState<VolunteerLog[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [sortField, setSortField] = useState<"checkInTime" | "hoursWorked" | "volunteer">("checkInTime");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedVolunteer) params.set("volunteerId", selectedVolunteer);
        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);

        const res = await fetch(`/api/admin/volunteer/logs?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs);
          setSummary(data.summary);
        } else {
          console.error("Failed to fetch logs");
        }
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [selectedVolunteer, startDate, endDate]);

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter logs by search term
  const filteredLogs = logs.filter((log) => {
    const name = `${log.volunteer.firstName} ${log.volunteer.lastName}`.toLowerCase();
    const email = log.volunteer.emailAddress.toLowerCase();
    const eventName = log.event.name.toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || email.includes(term) || eventName.includes(term);
  });

  // Sort logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    let cmp = 0;
    if (sortField === "checkInTime") {
      cmp = new Date(a.checkInTime).getTime() - new Date(b.checkInTime).getTime();
    } else if (sortField === "hoursWorked") {
      cmp = a.hoursWorked - b.hoursWorked;
    } else if (sortField === "volunteer") {
      cmp = `${a.volunteer.firstName} ${a.volunteer.lastName}`.localeCompare(
        `${b.volunteer.firstName} ${b.volunteer.lastName}`
      );
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  // Get unique volunteers for filter dropdown
  const uniqueVolunteers = Array.from(
    new Map(logs.map((l) => [l.volunteer.id, l.volunteer])).values()
  );

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setSelectedVolunteer("");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Volunteer Clock In/Out Logs</h1>
        <p className="text-gray-500 mt-1">Track volunteer attendance, hours worked, and session history</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="bg-[#7FA7D8] rounded-2xl p-6 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{summary.totalSessions}</p>
                <p className="text-sm mt-1 opacity-90">Total Sessions</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#4C7AB8] rounded-2xl p-6 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{summary.totalHours}</p>
                <p className="text-sm mt-1 opacity-90">Total Hours Logged</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#2E5A8E] rounded-2xl p-6 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{summary.uniqueVolunteers}</p>
                <p className="text-sm mt-1 opacity-90">Active Volunteers</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
            />
          </div>

          {/* Volunteer Filter */}
          <div className="min-w-[180px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Volunteer</label>
            <select
              value={selectedVolunteer}
              onChange={(e) => setSelectedVolunteer(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm bg-white"
            >
              <option value="">All Volunteers</option>
              {uniqueVolunteers.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.firstName} {v.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
            />
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading logs...
          </div>
        ) : sortedLogs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-lg font-medium">No attendance logs found</p>
            <p className="text-sm mt-1">Try adjusting your filters or date range</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th
                  className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort("volunteer")}
                >
                  Volunteer <SortIcon field="volunteer" />
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th
                  className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort("checkInTime")}
                >
                  Clock In <SortIcon field="checkInTime" />
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Clock Out
                </th>
                <th
                  className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort("hoursWorked")}
                >
                  Hours <SortIcon field="hoursWorked" />
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedLogs.map((log) => {
                const isComplete = log.checkOutTime !== null;
                return (
                  <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {log.volunteer.firstName} {log.volunteer.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{log.volunteer.emailAddress}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {log.event.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(log.checkInTime)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center text-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        {formatTime(log.checkInTime)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center text-sm">
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        {formatTime(log.checkOutTime)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">{log.hoursWorked}</span>
                      <span className="text-xs text-gray-400 ml-1">hrs</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          isComplete
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {isComplete ? "Completed" : "In Progress"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Table Footer */}
        {sortedLogs.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{sortedLogs.length}</span> of{" "}
              <span className="font-medium">{logs.length}</span> records
            </p>
            <p className="text-sm text-gray-500">
              Filtered Total:{" "}
              <span className="font-semibold">
                {Math.round(sortedLogs.reduce((s, l) => s + l.hoursWorked, 0) * 100) / 100} hrs
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
