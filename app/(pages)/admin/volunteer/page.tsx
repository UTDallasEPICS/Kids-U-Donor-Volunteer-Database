"use client";

import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  registration: boolean;
}

const headCells = [
  { id: "name", numeric: false, label: "Name" },
  { id: "email", numeric: false, label: "Email" },
  { id: "registration", numeric: false, label: "Registration Status" },
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

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  const fetchVolunteersData = async () => {
    try {
      const response = await fetch("/api/admin/volunteer/get", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || "Something went wrong";
        throw new Error(message);
      }

      const result = await response.json();

      setVolunteers(result.volunteers);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching:", error);
      router.push("/not-found");
    }
  };

  useEffect(() => {
    fetchVolunteersData();
  }, []);

  return (
    <Box sx={styles.box}>
      {isLoading ? (
        <Loading />
      ) : (
        <TableContainer>
          <Table stickyHeader sx={styles.table} aria-labelledby="tableTitle" size="small">
            <TableHeader />
            <TableBody>
              {volunteers.map((volunteer) => (
                <TableRow hover key={volunteer.id}>
                  <TableCell sx={styles.tableCell}>
                    <Link className="text-blue-500" href={`/admin/volunteer/${volunteer.id}`}>
                      {`${volunteer.firstName} ${volunteer.lastName}`}
                    </Link>
                  </TableCell>
                  <TableCell sx={styles.tableCell}>{volunteer.emailAddress}</TableCell>
                  <TableCell sx={styles.tableCell}>{volunteer.registration ? "Registered" : "Not Registered"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

const styles = {
  box: {
    marginLeft: "1em",
    marginRight: "1em",
    marginTop: "5em",
  },
  table: {
    minWidth: 750,
    borderLeft: "1px solid #ccc",
    borderRight: "1px solid #ccc",
    borderTop: "1px solid #ccc",
  },
  tableCellHeader: {
    fontWeight: "bold",
  },
  tableCell: {
    borderTop: "1px solid #ccc",
  },
};