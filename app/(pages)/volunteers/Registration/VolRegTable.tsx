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
  }, []);


  const handleViewEvent = (id: string) => {
    router.push(`/volunteers/Registration/Event_Reg?eventID=${id}`);
 
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
              <TableCell sx={{ fontWeight: '600' }}>Event Name</TableCell>
              <TableCell sx={{ fontWeight: '600' }} align="right">Date</TableCell>
              <TableCell sx={{ fontWeight: '600' }} align="right">Time</TableCell>
              <TableCell sx={{ fontWeight: '600' }} align="right">Location</TableCell>
              <TableCell sx={{ fontWeight: '600' }} align="right">Description</TableCell>
              <TableCell sx={{ fontWeight: '600' }} align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow
                key={event.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {event.name}
                </TableCell>
                <TableCell align="right">
                  {new Date(event.schedule).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </TableCell>
                <TableCell align="right">
                  {new Date(event.schedule).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </TableCell>
                <TableCell align="right">
                  {event.location ? `${event.location.name} - ${event.location.city}, ${event.location.state}` : 'No location set'}
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
