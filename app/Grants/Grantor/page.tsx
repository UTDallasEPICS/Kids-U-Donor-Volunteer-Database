"use client";
import React, { useState, useEffect } from "react";
import { Grantor, Representative } from "@/prisma"
import {
    Box,
    TextField,
    Typography,
    Breadcrumbs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material'
import Link from "next/link"
export default function GrantorsPage() {
    const [grantorsData, setGrantorsData] = useState<Grantor[]>([]); // State to store grants data

    useEffect(() => {
        fetchGrantorsData();
    }, []);

    const fetchGrantorsData = async () => {
        try {
            const response = await fetch("/api/grantors");
            const result = await response.json();
            setGrantorsData(result.data);
        } catch (error) {
            console.error("Error fetching grantors:", error);
        }
    };

    return (
        <Box>
            <Box>
                <Breadcrumbs aria-label="breadcrumb">
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
                                <TableCell style={styles.tableCellHeader}>Name</TableCell>
                                <TableCell style={styles.tableCellHeader}>Representative</TableCell>
                                <TableCell style={styles.tableCellHeader}>Type</TableCell>
                                <TableCell style={styles.tableCellHeader}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {grantorsData.map((grantors) => (
                                <TableRow
                                    key={grantors.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell style={styles.tableCell}>{grantors.websiteLink}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box >
    );
}

const styles = {
    table: {
        minWidth: 650,
    },
    tableCellHeader: {
        fontWeight: "bold",
        border: "1px solid #ccc",
    },
    tableCell: {
        border: "1px solid #ccc",
    },
    center: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        marginLeft: "auto",
        marginRight: "auto",
    }
};