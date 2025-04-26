"use client";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface OrientationItem {
  id: number;
  name: string;
  schedule: string;
  description: string;
  capacity: number;
  location: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

export default function OrientationList() {
  const [items, setItems] = useState<OrientationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US");
  };

  const handleClick = (id: number) => {
    router.push(`/admin/orientations/detail?id=${id}`);
  };

  useEffect(() => {
    fetch("/api/orientations/get")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading orientations.</p>;
  if (!items.length) return <p>No orientations available.</p>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="orientation table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "600" }}>Orientation Name</TableCell>
            <TableCell sx={{ fontWeight: "600" }} align="right">
              Date
            </TableCell>
            <TableCell sx={{ fontWeight: "600" }} align="right">
              Time
            </TableCell>
            <TableCell sx={{ fontWeight: "600" }} align="right">
              Location
            </TableCell>
            <TableCell sx={{ fontWeight: "600" }} align="right">
              Capacity
            </TableCell>
       
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">{item.name}</TableCell>
              <TableCell align="right">{formatDate(item.schedule)}</TableCell>
              <TableCell align="right">{formatTime(item.schedule)}</TableCell>
              <TableCell align="right">
                {item.location?.name
                  ? `${item.location.name}${item.location.city ? `, ${item.location.city}` : ""}`
                  : "N/A"}
              </TableCell>
              <TableCell align="right">{item.capacity}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
