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
    /*const [grantsData, setGrantsData] = useState<Grant[]>([]); // State to store grants data
  
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
    };*/

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
                    <Typography sx={{ color: 'text.primary' }}>Grantor List</Typography>
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
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Representative</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
            </Box>
        </Box >
    );
}