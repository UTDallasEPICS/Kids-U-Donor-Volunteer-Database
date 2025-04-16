import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  TablePagination,
  TableFooter,
  IconButton,
  TableContainer,
  useTheme,
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Link from "next/link";
import { useEffect, useState } from "react";
import React from "react";
import { DonationTableState } from "../../types/states";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string | Date }, b: { [key in Key]: number | string | Date }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

type TableProps = {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof DonationTableState) => void;
  order: Order;
  orderBy: string;
};

type HeadCell = {
  id: keyof DonationTableState;
  numeric: boolean;
  label: string;
};

const headCells: HeadCell[] = [
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

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export const TableHeader = (props: TableProps) => {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property: keyof DonationTableState) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            style={styles.tableCellHeader}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export const MiniDonationsTable = ({ donations }: { donations: DonationTableState[] }) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof DonationTableState>("type");

  useEffect(() => {});

  const visibleRows = React.useMemo(
    () => [...donations].sort(getComparator(order, orderBy)),
    [order, orderBy, donations]
  );

  const handleSort = (event: React.MouseEvent<unknown>, property: keyof DonationTableState) => {
    const isAscending: boolean = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - donations.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer>
      <Table stickyHeader sx={styles.table} aria-labelledby="tableTitle">
        <TableHeader order={order} orderBy={orderBy} onRequestSort={handleSort} />
        <TableBody>
          {visibleRows.map((donation) => {
            return (
              <TableRow hover key={donation.id}>
                <TableCell sx={styles.tableCell}>
                  <Link className="text-blue-500" href={`/donations/detail/${donation.id}`}>
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

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={5}
              count={donations.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    "aria-label": "rows per page",
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
      </Table>
    </TableContainer>
  );
};

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
