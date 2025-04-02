"use client";
import React, { useState, useEffect } from "react";
import type { Volunteer } from "@/prisma";
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
  "name",
  "emailAddress",
  "phoneNumber",
  "addressLine",
  "city",
  "state",
  "zipCode",
  "usCitizen",
  "reliableTransport",
  "speakSpanish",
  //"emergencyContact"
];

const searchOptions = [
  "name",
  "city",
  "usCitizen",
  "speakSpanish"
];

export default function VolunteersPage() {
  const [volsData, setVolsData] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("");

  const fetchVolsData = async () => {
    try {
      const response = await fetch(`/api/volunteer?page=${page}&rowsPerPage=${rowsPerPage}&searchCriteria=${searchCriteria}&searchValue=${searchValue}`);
      const result = await response.json();
      setVolsData(result.data);
      setTotalCount(result.count);
      console.log(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
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
      if (sessionStorage.getItem("page") !== "VolunteerList") {
        sessionStorage.clear();
      }
      sessionStorage.setItem("page", "VolunteerList");

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
    fetchVolsData();
  }, [page, rowsPerPage, searchValue, searchCriteria]);

  if (loading) {
    return <CircularProgress style={styles.center} />
  }

  return (
    <Box>
      <Box>
        <Breadcrumbs style={styles.breadcrumb}>
          <Link href={"/"} style={{ textDecoration: 'underline', }}>Dashboard</Link>
          <Typography>Volunteers</Typography>
          <Typography>Volunteers List</Typography>
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
                {selectedColumns.includes("city") && <TableCell style={styles.tableCellHeader}>City</TableCell>}
                {selectedColumns.includes("emailAddress") && <TableCell style={styles.tableCellHeader}>Email Representative</TableCell>}
                {selectedColumns.includes("name") && <TableCell style={styles.tableCellHeader}>Name</TableCell>}
                {selectedColumns.includes("phoneNumber") && <TableCell style={styles.tableCellHeader}>Phone Number</TableCell>}
                {selectedColumns.includes("addressLine") && <TableCell style={styles.tableCellHeader}>Address</TableCell>}
                {selectedColumns.includes("state") && <TableCell style={styles.tableCellHeader}>State</TableCell>}
                {selectedColumns.includes("zipCode") && <TableCell style={styles.tableCellHeader}>Zipcode</TableCell>}
                {selectedColumns.includes("usCitizen") && <TableCell style={styles.tableCellHeader}>US Citizen</TableCell>}
                {selectedColumns.includes("reliableTransport") && <TableCell style={styles.tableCellHeader}>Reliable Transport</TableCell>}
                {selectedColumns.includes("speakSpanish") && <TableCell style={styles.tableCellHeader}>Speak Spanish</TableCell>}
                
              </TableRow>
            </TableHead>
            <TableBody>
              {volsData?.map((volunteer) => (
                <TableRow key={volunteer.id}>
                  {selectedColumns.includes("city") && <TableCell style={styles.tableCell}>{volunteer.city}</TableCell>}
                  {selectedColumns.includes("emailAddress") && <TableCell style={styles.tableCell}>{volunteer.emailAddress}</TableCell>}
                  {selectedColumns.includes("name") && <TableCell style={styles.tableCell}>{volunteer.firstName} {volunteer.lastName}</TableCell>}
                  {selectedColumns.includes("phoneNumber") && <TableCell style={styles.tableCell}>{volunteer.phoneNumber}</TableCell>}
                  {selectedColumns.includes("addressLine") && <TableCell style={styles.tableCell}>{volunteer.addressLine}</TableCell>}
                  {selectedColumns.includes("state") && <TableCell style={styles.tableCell}>{volunteer.state}</TableCell>}
                  {selectedColumns.includes("zipCode") && <TableCell style={styles.tableCell}>{volunteer.zipCode}</TableCell>}
                  {selectedColumns.includes("usCitizen") && <TableCell style={styles.tableCell}>{volunteer.usCitizen?"Yes" : "No"}</TableCell>}
                  {selectedColumns.includes("reliableTransport") && <TableCell style={styles.tableCell}>{volunteer.reliableTransport?"Yes" : "No"}</TableCell>}
                  {selectedColumns.includes("speakSpanish") && <TableCell style={styles.tableCell}>{volunteer.speakSpanish?"Yes" : "No"}</TableCell>}
                  
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
