"use client";
import React, { useState, useEffect } from "react";
import type { Donation } from "@/prisma";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Link from "next/link";

/*
place holder list
*/

const headCells = [
  {
    id: "type",
    numeric: false,
    label: "Donation Type",
  },
  {
    id: "amount",
    numeric: true,
    label: "Donation Amount / Item(s) Value",
  },
  {
    id: "item",
    numeric: false,
    label: "Item",
  },
  {
    id: "paymentMethod",
    numeric: false,
    label: "Method",
  },
  {
    id: "date",
    numeric: false,
    label: "Date",
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

export default function DonationsList() {
  const [data, setData] = useState<Donation[]>([]);

  const fetchDonationsData = async () => {
    try {
      const response = await fetch("/api/donations", {
        method: "GET",
      });
      const result = await response.json();

      setData(result.data);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };
  useEffect(() => {
    fetchDonationsData();
  }, []);

  return (
    <TableContainer>
      <Table stickyHeader sx={styles.table} aria-labelledby="tableTitle">
        <TableHeader />
        <TableBody>
          {data.map((donation) => {
            return (
              <TableRow hover key={donation.id}>
                <TableCell sx={styles.tableCell}>
                  <Link className="text-blue-500" href={`/Donations/Detail/${donation.id}`}>
                    {donation.type}
                  </Link>
                </TableCell>
                <TableCell sx={styles.tableCell} align="right">
                  ${donation.amount}
                </TableCell>
                <TableCell sx={styles.tableCell}>{donation.type !== "In-Kind" ? "" : donation.item}</TableCell>
                <TableCell sx={styles.tableCell}>{donation.type !== "In-Kind" ? donation.paymentMethod : ""}</TableCell>
                <TableCell sx={styles.tableCell}>{new Date(donation.date).toLocaleDateString()}</TableCell>
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
