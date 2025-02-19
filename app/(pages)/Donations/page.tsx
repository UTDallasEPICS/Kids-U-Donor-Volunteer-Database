"use client";
import React, { useState, useEffect } from "react";
import type { Donation } from "@/prisma";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  const fetchDonationsData = async () => {
    try {
      const response = await fetch("/api/donations", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || "Something went wrong";
        throw new Error(message);
      }

      const result = await response.json();

      setData(result.data);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching:", error);
      router.push("/not-found");
    }
  };
  useEffect(() => {
    fetchDonationsData();
  }, []);

  return (
    <Box>
      {isLoading ? (
        <Loading />
      ) : (
        <TableContainer>
          <Table stickyHeader sx={styles.table} aria-labelledby="tableTitle">
            <TableHeader />
            <TableBody>
              {data.map((donation) => {
                return (
                  <TableRow hover key={donation.id}>
                    <TableCell sx={styles.tableCell}>
                      <Link className="text-blue-500" href={`/donations/Detail/${donation.id}`}>
                        {donation.type}
                      </Link>
                    </TableCell>
                    <TableCell sx={styles.tableCell} align="right">
                      ${donation.amount}
                    </TableCell>
                    <TableCell sx={styles.tableCell}>{donation.type !== "In-Kind" ? "" : donation.item}</TableCell>
                    <TableCell sx={styles.tableCell}>
                      {donation.type !== "In-Kind" ? donation.paymentMethod : ""}
                    </TableCell>
                    <TableCell sx={styles.tableCell}>{new Date(donation.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
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
