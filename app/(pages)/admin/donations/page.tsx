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
  { id: "donorType", numeric: false, label: "Donor Type" },
  { id: "donor", numeric: false, label: "Donor" },
  { id: "amount", numeric: true, label: "Amount" },
  { id: "date", numeric: false, label: "Date" },
  { id: "campaign", numeric: false, label: "Campaign" },
  { id: "paymentMethod", numeric: false, label: "Method" },
  { id: "type", numeric: false, label: "Type" },
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
      const response = await fetch("/api/admin/donations", {
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
                const donorName = donation?.donor?.person
                  ? `${donation.donor.person.firstName} ${donation.donor.person.lastName}`
                  : donation?.donor?.organization?.name || "—";
                const amount = typeof donation.amount === "number" ? donation.amount : Number(donation.amount ?? 0);
                const donorType = donation?.donor?.type || "";
                return (
                  <TableRow hover key={donation.id}>
                    <TableCell sx={styles.tableCell}>
                      <Link className="text-blue-500" href={`/admin/donations/detail/${donation.id}`}>
                        {donorType}
                      </Link>
                    </TableCell>
                    <TableCell sx={styles.tableCell}>{donorName}</TableCell>
                    <TableCell sx={styles.tableCell} align="right">${amount.toFixed(2)}</TableCell>
                    <TableCell sx={styles.tableCell}>{new Date(donation.date).toLocaleDateString()}</TableCell>
                    <TableCell sx={styles.tableCell}>{donation.campaign || ""}</TableCell>
                    <TableCell sx={styles.tableCell}>{donation.type !== "In-Kind" ? (donation.paymentMethod || "") : ""}</TableCell>
                    <TableCell sx={styles.tableCell}>{donation.type}</TableCell>
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
