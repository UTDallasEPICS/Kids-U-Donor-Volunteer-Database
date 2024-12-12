"use client";

import {
  Box,
  Table,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  TablePagination,
  TableFooter,
  IconButton,
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Link from "next/link";
import { useEffect, useState } from "react";
import React from "react";

import { donors, Donation } from "../utils/donationTestData";

/*
type TablePaginationActionsProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
};

const PaginationActions = (props: TablePaginationActionsProps) => {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {<KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {<KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {}
      </IconButton>
    </Box>
  );
};

*/

export default function Donations() {
  const [sortBy, setSortBy] = useState("None");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(() => { });
  /*
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  */

  const moneyDonation = (donor: Donation) => {
    return (
      <TableRow key={donor.id}>
        <TableCell style={styles.tableCell}>
          <Link
            className="text-blue-500"
            href={`/Donations/Detail/${donor.id}`}
          >
            {donor.donor.name.trim()}
          </Link>
        </TableCell>
        <TableCell style={styles.tableCell}>{donor.category.trim()}</TableCell>
        <TableCell style={styles.tableCell}>
          ${donor.amount !== null ? donor.amount.toFixed(2) : -100}
        </TableCell>
        <TableCell style={styles.tableCell}>
          {donor.paymentMethod !== null ? donor.paymentMethod : "N/A"}
        </TableCell>
        <TableCell style={styles.tableCell}>{donor.campaign}</TableCell>
        <TableCell style={styles.tableCell}>
          {donor.date.toLocaleDateString()}
        </TableCell>
      </TableRow>
    );
  };

  const itemDonation = (donor: Donation) => {
    return (
      <TableRow key={donor.id}>
        <TableCell style={styles.tableCell}>
          <Link
            className="text-blue-500"
            href={`/Donations/Detail/${donor.id}`}
          >
            {donor.donor.name.trim()}
          </Link>
        </TableCell>
        <TableCell style={styles.tableCell}>{donor.category.trim()}</TableCell>
        <TableCell style={styles.tableCell}>{donor.item}</TableCell>
        <TableCell style={styles.tableCell}>${donor.itemValue}</TableCell>
        <TableCell style={styles.tableCell}>{donor.campaign}</TableCell>
        <TableCell style={styles.tableCell}>
          {donor.date.toLocaleDateString()}
        </TableCell>
      </TableRow>
    );
  };

  const TableHeader = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell style={styles.tableCellHeader}>Donor Name</TableCell>
          <TableCell style={styles.tableCellHeader}>Category</TableCell>
          <TableCell style={styles.tableCellHeader}>Donation</TableCell>
          <TableCell style={styles.tableCellHeader}>Method/Value</TableCell>
          <TableCell style={styles.tableCellHeader}>Campaign</TableCell>
          <TableCell style={styles.tableCellHeader}>Donation Date</TableCell>
        </TableRow>
      </TableHead>
    );
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h5">Donations</Typography>
      <Table style={styles.table}>
        <TableHeader />
        <TableBody>
          {donors.map((donor) =>
            donor.category === "Money"
              ? moneyDonation(donor)
              : itemDonation(donor)
          )}
        </TableBody>
        {/*
        <TableFooter>
          <TableRow>
            <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            colSpan={3}
            count={}
            rowsPerPage={rowsPerPage}
            page={page}
            slotProps={{
              select: {
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              },
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
        */}
      </Table>
    </Box>
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
};
