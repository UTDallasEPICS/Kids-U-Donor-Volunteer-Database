"use client";
import React, { useState, useEffect } from "react";
import type { Grant } from "@/prisma";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function GrantsPage() {
  const [grantsData, setGrantsData] = useState<Grant[]>([]); // State to store grants data

  useEffect(() => {
    fetchGrantsData();
  }, []);

  const fetchGrantsData = async () => {
    try {
      const response = await fetch("/api/grants/");
      const result = await response.json();
      setGrantsData(result.data);
    } catch (error) {
      console.error("Error fetching grants:", error);
    }
  };

  return (
    <Box>
      <Box>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
          >
            Grants
          </Link>
          <Typography sx={{ color: 'text.primary' }}>Grant List</Typography>
        </Breadcrumbs>
      </Box>
      <Box>
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
          noValidate
          autoComplete="off"
        >
          <TextField id="outlined-basic" label="Search" variant="outlined" size="small" />
        </Box>
      </Box>
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Organization</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Requested Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Awarded Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Report Due Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Restrictions</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Award Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grantsData.map((grant) => (
                <TableRow
                  key={grant.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{<Link href={`/Grants/Detail/${grant.id}`}>
                    {grant.name}
                  </Link>}</TableCell>
                  <TableCell>{grant.status}</TableCell>
                  <TableCell>{grant.}</TableCell>
                  <TableCell>{grant.}</TableCell>
                  <TableCell>{grant.
                    ? new Date(grant.).toLocaleDateString()
                    : "N/A"}
                  </TableCell>
                  <TableCell>{grant.
                    ? new Date(
                    grant.EndOfGrantReportDueDate
                  ).toLocaleDateString()
                    : "N/A"}
                  </TableCell>
                  <TableCell>{grant.}</TableCell>
                  <TableCell>{grant.AwardDate
                    ? new Date(grant.AwardDate).toLocaleDateString()
                    : "Not Awarded Yet"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box >
  );
}
