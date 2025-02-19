"use client";
import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Link from "next/link";
import { Donor } from "@prisma/client";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  const fetchDonorData = async () => {
    try {
      const response = await fetch("/api/donors", {
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
    fetchDonorData();
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
              {data.map((donor) => {
                return (
                  <TableRow hover key={donor.id}>
                    <TableCell sx={styles.tableCell}>
                      <Link className="text-blue-500" href={`/donors/Detail/${donor.id}`}>
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
