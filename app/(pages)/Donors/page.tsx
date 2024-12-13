"use client";
import React, { useState, useEffect } from "react";
import type { Donation } from "@/prisma";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Link from "next/link";
import { Donor } from "@prisma/client";

/*
place holder list
*/

const headCells = [
  {
    id: "type",
    numeric: false,
    label: "Donor Type",
  },
  {
    id: "commPref",
    numeric: false,
    label: "Communication Preference",
  },
  {
    id: "status",
    numeric: false,
    label: "Status",
  },
];
export const TableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell: any) => (
          <TableCell key={headCell.id} style={styles.tableCellHeader}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default function DonorsList() {
  const [data, setData] = useState<Donor[]>([]);

  const fetchDonorData = async () => {
    try {
      const response = await fetch("/api/donors", {
        method: "GET",
      });
      const result = await response.json();
      console.log(result.data);
      setData(result.data);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };
  useEffect(() => {
    fetchDonorData();
  }, []);

  return (
    <TableContainer>
      <Table stickyHeader sx={styles.table} aria-labelledby="tableTitle">
        <TableHeader />
        <TableBody>
          {data.map((donor) => {
            return (
              <TableRow hover key={donor.id}>
                <TableCell sx={styles.tableCell}>
                  <Link className="text-blue-500" href={`/Donors/Detail/${donor.id}`}>
                    {donor.type}
                  </Link>
                </TableCell>
                <TableCell sx={styles.tableCell}>{donor.communicationPreference}</TableCell>
                <TableCell sx={styles.tableCell}>{donor.status}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const styles = {
  table: {
    minWidth: 750,
  },
  tableCellHeader: {
    fontWeight: "bold",
  },
  tableCell: {
    borderTop: "1px solid #ccc",
  },
};
