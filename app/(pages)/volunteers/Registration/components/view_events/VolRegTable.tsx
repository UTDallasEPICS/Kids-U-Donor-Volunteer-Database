"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface Event {
  id: string;
  name: string;
  schedule: string;
  description: string;
  bgCheckRequired: boolean;
  location: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  } | null;
}

export const VolRegTable = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bgCheckApproved, setBgCheckApproved] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/events/get")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    fetch("/api/background-check/get")
      .then((res) => res.json())
      .then((data) => {
        if (data.submitted && data.record?.approved) {
          setBgCheckApproved(true);
        } else {
          setBgCheckApproved(false);
        }
      })
      .catch(() => setBgCheckApproved(false));
  }, []);

  const handleViewEvent = (id: string) => {
    router.push(`/volunteers/registration/event_registration?eventID=${id}`);
  };

  const Breadcrumb = () => (
    <div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
      <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">Home</span>
      <span className="text-gray-400">/</span>
      <span className="font-semibold text-gray-700">Registration</span>
    </div>
  );

  const Header = () => (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-bold text-gray-800">Available Events</h1>
      <div className="flex items-center gap-2 text-sm font-medium">
        {bgCheckApproved === true ? (
          <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            BG Checked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Not BG Checked
          </span>
        )}
      </div>
    </div>
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error}</p>;
  if (!events.length) return <p>No events available</p>;

  return (
    <div className="p-6">
      <Breadcrumb />
      <Header />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="events table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "600" }}>Event Name</TableCell>
              <TableCell sx={{ fontWeight: "600" }} align="right">Date</TableCell>
              <TableCell sx={{ fontWeight: "600" }} align="right">Time</TableCell>
              <TableCell sx={{ fontWeight: "600" }} align="right">Location</TableCell>
              <TableCell sx={{ fontWeight: "600" }} align="right">Description</TableCell>
              <TableCell sx={{ fontWeight: "600" }} align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <div className="flex items-center gap-2">
                    {event.name}
                    {event.bgCheckRequired && (
                      <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        BG Check Required
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell align="right">
                  {new Date(event.schedule).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell align="right">
                  {new Date(event.schedule).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </TableCell>
                <TableCell align="right">
                  {event.location
                    ? `${event.location.name} - ${event.location.city}, ${event.location.state}`
                    : "No location set"}
                </TableCell>
                <TableCell align="right">{event.description}</TableCell>
                <TableCell align="right">
                  <button
                    onClick={() => handleViewEvent(event.id)}
                    className="bg-[#0d1a2d] text-white px-4 py-2 rounded-lg"
                  >
                    Register
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
