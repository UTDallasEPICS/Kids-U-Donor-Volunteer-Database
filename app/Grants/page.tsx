"use client";
import React, { useState, useEffect } from "react";
import type { Grant } from "@/prisma";
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
  Paper,
  CircularProgress
} from "@mui/material"
import Link from "next/link"
import { alignProperty } from "@mui/material/styles/cssUtils";

export default function GrantsPage() {
  const [grantsData, setGrantsData] = useState<Grant[]>([]); // State to store grants data
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchGrantsData();
  }, []);

  const fetchGrantsData = async () => {
    try {
      const response = await fetch("/api/grants/");
      const result = await response.json();
      setGrantsData(result.data);
      console.log(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching grants:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress style={styles.center} />
  }

  return (
    <Box>
      <Box>
        <Breadcrumbs aria-label="breadcrumb">
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
                <TableCell style={styles.tableCellHeader}>Grantor</TableCell>
                <TableCell style={styles.tableCellHeader}>Representative</TableCell>
                <TableCell style={styles.tableCellHeader}>Name</TableCell>
                <TableCell style={styles.tableCellHeader}>Status</TableCell>
                <TableCell style={styles.tableCellHeader}>Purpose</TableCell>
                <TableCell style={styles.tableCellHeader}>Start Date</TableCell>
                <TableCell style={styles.tableCellHeader}>End Date</TableCell>
                <TableCell style={styles.tableCellHeader}>Award Notification Date</TableCell>
                <TableCell style={styles.tableCellHeader}>Amount Awarded</TableCell>
                <TableCell style={styles.tableCellHeader}>Amount Requested</TableCell>
                <TableCell style={styles.tableCellHeader}>Proposal Due Date</TableCell>
                <TableCell style={styles.tableCellHeader}>Proposal Submission Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grantsData.map((grant) => (
                <TableRow
                  key={grant.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell style={styles.tableCell}>{"n"}</TableCell>
                  <TableCell style={styles.tableCell}>{"n"}</TableCell>
                  <TableCell style={styles.tableCell}>{
                    <Link href={`/Grants/Detail/${grant.id}`}>
                      {grant.name}</Link>}
                  </TableCell>
                  <TableCell style={styles.tableCell}>{grant.status}</TableCell>
                  <TableCell style={styles.tableCell}>{grant.purpose}</TableCell>
                  <TableCell style={styles.tableCell}>{new Date(grant.startDate).toLocaleDateString()}</TableCell>
                  <TableCell style={styles.tableCell}>{new Date(grant.endDate).toLocaleDateString()}</TableCell>
                  <TableCell style={styles.tableCell}>{
                    grant.awardNotificationDate ? new Date(grant.awardNotificationDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell style={styles.tableCell}>{grant.amountAwarded}</TableCell>
                  <TableCell style={styles.tableCell}>{grant.amountRequested}</TableCell>
                  <TableCell style={styles.tableCell}>{new Date(grant.proposalDueDate).toLocaleDateString()}</TableCell>
                  <TableCell style={styles.tableCell}>{
                    grant.proposalSubmissionDate ? new Date(grant.proposalSubmissionDate).toLocaleDateString()
                      : "N/A"}
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
