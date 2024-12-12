"use client";
import React, { useState, useEffect } from "react";
import type { Donation } from "@/prisma";
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
  TablePagination,
  Paper,
  CircularProgress,
  TableFooter,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from "@mui/material"
import Grid from "@mui/material/Grid2";
import Link from "next/link"

const columns = [
  "donor",
  "type",
  "amount",
  "paymentMethod",
  "campaign",
  "date",
  "fundDesignation",
  "source",
];

const searchOptions = [
  "donor",
  "campaign",
  "fundDesignation"
];

export default function DonationsPage() {
  const [donationsData, setDonationsData] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("");

  const fetchDonationsData = async () => {
    try {
      const response = await fetch(`/api/donations/get?page=${page}&rowsPerPage=${rowsPerPage}&searchCriteria=${searchCriteria}&searchValue=${searchValue}`);
      const result = await response.json();
      setDonationsData(result.data);
      setTotalCount(result.count);
      console.log(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching grants:", error);
      setLoading(false);
    }
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); //Bring back to first page
  };

  const handleColumnChange = (event: SelectChangeEvent<typeof selectedColumns>) => {
    const {
      target: { value },
    } = event;
    setSelectedColumns(
      typeof value === "string" ? value.split(",") : value,
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchValue(event.target.value as string);
  };

  const handleCriteriaChange = (event: SelectChangeEvent<string>) => {
    setSearchCriteria(event.target.value as string);
  };

  useEffect(() => {
    if (typeof window !== "undefined") { //This ensures the code runs only in the browser
      //sessionStorage for selected columns
      if (sessionStorage.getItem("page") !== "donationList") {
        sessionStorage.clear();
      }
      sessionStorage.setItem("page", "donationList");

      const savedColumns = sessionStorage.getItem("selectedColumns");
      if (savedColumns) {
        setSelectedColumns(JSON.parse(savedColumns));
      } else {
        setSelectedColumns(columns);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && selectedColumns.length > 0) {
      sessionStorage.setItem("selectedColumns", JSON.stringify(selectedColumns));
    }
  }, [selectedColumns]);

  useEffect(() => {
    fetchDonationsData();
  }, [page, rowsPerPage, searchValue, searchCriteria]);

  if (loading) {
    return <CircularProgress style={styles.center} />
  }

  return (
    <Box>
      <Box>
        <Breadcrumbs style={styles.breadcrumb}>
          <Link href={"/"} style={{ textDecoration: 'underline', }}>Dashboard</Link>
          <Typography>Donations</Typography>
          <Typography>Donations List</Typography>
        </Breadcrumbs>
      </Box>
      <Box>
        <Grid container spacing={2} alignItems="center" marginLeft={2} marginTop={1} marginBottom={1}>
          <Grid>
            <FormControl variant="outlined" sx={{ width: 150 }}>
              <InputLabel>Search By</InputLabel>
              <Select
                label="Search By"
                value={searchCriteria}
                onChange={handleCriteriaChange}
              >
                {searchOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    <ListItemText>{option}</ListItemText>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <TextField
              label="Search Value"
              variant="outlined"
              name="value"
              value={searchValue}
              onChange={handleSearchChange}
              disabled={!searchCriteria} //Disable search input until something is selected
            />
          </Grid>
          <Grid>
            <FormControl sx={{ width: 500 }}>
              <InputLabel>Included Columns</InputLabel>
              <Select
                multiple
                value={selectedColumns}
                onChange={handleColumnChange}
                input={<OutlinedInput label="Included Columns" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {columns.map((col) => (
                  <MenuItem key={col} value={col}>
                    <Checkbox checked={selectedColumns.includes(col)} />
                    <ListItemText primary={col} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                {selectedColumns.includes("donor") && <TableCell style={styles.tableCellHeader}>Donor</TableCell>}
                {selectedColumns.includes("type") && <TableCell style={styles.tableCellHeader}>Donation Type</TableCell>}
                {selectedColumns.includes("amount") && <TableCell style={styles.tableCellHeader}>Amount</TableCell>}
                {selectedColumns.includes("paymentMethod") && <TableCell style={styles.tableCellHeader}>Payment Method</TableCell>}
                {selectedColumns.includes("campaign") && <TableCell style={styles.tableCellHeader}>Campaign</TableCell>}
                {selectedColumns.includes("date") && <TableCell style={styles.tableCellHeader}>Date Donated</TableCell>}
                {selectedColumns.includes("fundDesignation") && <TableCell style={styles.tableCellHeader}>Fund Designation</TableCell>}
                {selectedColumns.includes("source") && <TableCell style={styles.tableCellHeader}>Donation Source</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {donationsData?.map((donation) => (
                <TableRow key={donation.id}>
                  {selectedColumns.includes("donor") && <TableCell style={styles.tableCell}>{donation.donor.personId ? donation.donor.person.firstName + " " + donation.donor.person.lastName : donation.donor.organization.name}</TableCell>}
                  {selectedColumns.includes("type") && <TableCell style={styles.tableCell}>{donation.type}</TableCell>}
                  {selectedColumns.includes("amount") && <TableCell style={styles.tableCell}>{"$" + donation.amount}</TableCell>}
                  {selectedColumns.includes("paymentMethod") && <TableCell style={styles.tableCell}>{donation.paymentMethod ? donation.paymentMethod : "N/A"}</TableCell>}
                  {selectedColumns.includes("campaign") && <TableCell style={styles.tableCell}>{donation.campaign ? donation.campaign : "N/A"}</TableCell>}
                  {selectedColumns.includes("date") && <TableCell style={styles.tableCell}>{new Date(donation.date).toLocaleDateString()}</TableCell>}
                  {selectedColumns.includes("fundDesignation") && <TableCell style={styles.tableCell}>{donation.fundDesignation}</TableCell>}
                  {selectedColumns.includes("source") && <TableCell style={styles.tableCell}>{donation.source}</TableCell>}
                </TableRow>
              )) ?? null}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={12} style={{ padding: 0 }}>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    style={styles.pagination}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
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
    border: "1px solid #aaa",
    backgroundColor: "#ccc",
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
  },
  pagination: {
    display: "flex",
    justifyContent: "left",
    width: "100%",
    backgroundColor: "#ccc",
  },
  breadcrumb: {
    marginLeft: "5px",
    marginTop: "8px"
  }
};