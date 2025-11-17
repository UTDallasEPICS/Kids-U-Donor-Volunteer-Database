"use client";
import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Link from "next/link";
import type { Donor as PrismaDonor } from "@prisma/client";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

/*
place holder list
*/

const headCells = [
  { id: "type", numeric: false, label: "Donor Type" },
  { id: "name", numeric: false, label: "Name" },
  { id: "email", numeric: false, label: "Email" },
  { id: "phone", numeric: false, label: "Phone" },
  { id: "total", numeric: true, label: "Total Donated" },
  { id: "last", numeric: false, label: "Last Donation" },
  { id: "status", numeric: false, label: "Status" },
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

type DonorWithRelations = PrismaDonor & {
  person?: { firstName: string; lastName: string; emailAddress: string; phoneNumber: string | null } | null;
  organization?: { name: string; emailAddress: string | null } | null;
  donation?: Array<{ amount: number; date: string }>;
};

export default function DonorsList() {
  const [data, setData] = useState<DonorWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  const fetchDonorData = async () => {
    try {
      const response = await fetch("/api/admin/donors", {
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
                const name = donor.person
                  ? `${donor.person.firstName} ${donor.person.lastName}`
                  : donor.organization?.name || "—";
                const email = donor.person?.emailAddress || donor.organization?.emailAddress || "";
                const phone = donor.person?.phoneNumber || "";
                const total = (donor.donation || []).reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
                const lastDateIso = donor.donation && donor.donation[0]?.date;
                const last = lastDateIso ? new Date(lastDateIso).toLocaleDateString() : "";

                return (
                  <TableRow hover key={donor.id}>
                    <TableCell sx={styles.tableCell}>
                      <Link className="text-blue-500" href={`/admin/donors/detail/${donor.id}`}>
                        {donor.type}
                      </Link>
                    </TableCell>
                    <TableCell sx={styles.tableCell}>{name}</TableCell>
                    <TableCell sx={styles.tableCell}>{email}</TableCell>
                    <TableCell sx={styles.tableCell}>{phone}</TableCell>
                    <TableCell sx={styles.tableCell} align="right">${total.toFixed(2)}</TableCell>
                    <TableCell sx={styles.tableCell}>{last}</TableCell>
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
