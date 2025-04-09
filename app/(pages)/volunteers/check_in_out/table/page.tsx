
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
interface EventItem{
  id: string;
  name: string;
  schedule: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  }
}

export default function BasicTable() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  }
  const formatTime = (dateString:string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US');
  }
  
   

  useEffect(() => {
    fetch("/api/events/get")
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
  if (error) return <p>Error loading data</p>;
  if (!items.length) return <p>No events available</p>;

  const handleClick = () => {
    router.push("/volunteers/check_in_out/clockinPage");
  };
 
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow >
            <TableCell sx={{ fontWeight: '600' }}>Event Name</TableCell>
            <TableCell sx={{ fontWeight: '600' }}align="right">Date</TableCell>
            <TableCell sx={{ fontWeight: '600' }}align="right">Time</TableCell>
            <TableCell sx={{ fontWeight: '600' }}align="right">Location</TableCell>
            <TableCell sx={{ fontWeight: '600' }}align="right">Clock-in/Clock-out</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id} 
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item.name} 
              </TableCell>
              <TableCell align="right">{formatDate(item.schedule)}</TableCell>
              <TableCell align="right">{formatTime(item.schedule)}</TableCell>
              <TableCell align="right">{item.location.address} , {item.location.city} {item.location.state}, {item.location.zipCode}</TableCell>
              <TableCell align="right" >
                <button className="bg-[#0d1a2d] text-white px-4 py-2 rounded-lg"onClick={handleClick}>Clock-in</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
