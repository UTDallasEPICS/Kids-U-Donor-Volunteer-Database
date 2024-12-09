"use client";
import React, { useState, useEffect } from "react";
import { Grantor } from "@/prisma"
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
  "type",
  "addressLine1",
  "addressLine2",
  "city",
  "state",
  "zipcode",
  "communicationPreference",
  "recognitionPreference",
];

const searchOptions = [
  "name",
  "type",
  "addressLine1",
  "city",
  "state",
  "zipcode",
];

export default function GrantorsPage() {
  const [grantorsData, setGrantorsData] = useState<Grantor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("");

  const fetchGrantsData = async () => {
    try {
      const response = await fetch(`/api/grantors?page=${page}&rowsPerPage=${rowsPerPage}&searchCriteria=${searchCriteria}&searchValue=${searchValue}`);
      const result = await response.json();
      setGrantorsData(result.data);
      setTotalCount(result.count);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching grantors:", error);
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
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchValue(event.target.value as string);
  };

  const handleCriteriaChange = (event: SelectChangeEvent<string>) => {
    setSearchCriteria(event.target.value as string);
  };

  //sessionStorage for selected columns
  if (sessionStorage.getItem("page") !== "grantorList") {
    sessionStorage.clear();
  }
  sessionStorage.setItem("page", "grantorList");

  useEffect(() => {
    if (typeof window !== 'undefined') { //This ensures the code runs only in the browser
      const savedColumns = sessionStorage.getItem('selectedColumns');
      if (savedColumns) {
        setSelectedColumns(JSON.parse(savedColumns));
      } else {
        setSelectedColumns(columns);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && selectedColumns.length > 0) {
      sessionStorage.setItem('selectedColumns', JSON.stringify(selectedColumns));
    }
  }, [selectedColumns]);

  useEffect(() => {
    fetchGrantsData();
  }, [page, rowsPerPage, searchValue, searchCriteria]);

  if (loading) {
    return <CircularProgress style={styles.center} />
  }

  return (
    <Box>
      <Box>
        <Breadcrumbs style={styles.breadcrumb}>
          <Link href={"/"}>Dashboard</Link>
          <Typography>Grants</Typography>
          <Typography>Grantor List</Typography>
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
                renderValue={(selected) => selected.join(', ')}
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
                {selectedColumns.includes("name") && <TableCell style={styles.tableCellHeader}>Name</TableCell>}
                {selectedColumns.includes("type") && <TableCell style={styles.tableCellHeader}>Type</TableCell>}
                {selectedColumns.includes("addressLine1") && <TableCell style={styles.tableCellHeader}>Address Line 1</TableCell>}
                {selectedColumns.includes("addressLine2") && <TableCell style={styles.tableCellHeader}>Address Line 2</TableCell>}
                {selectedColumns.includes("city") && <TableCell style={styles.tableCellHeader}>City</TableCell>}
                {selectedColumns.includes("state") && <TableCell style={styles.tableCellHeader}>State</TableCell>}
                {selectedColumns.includes("zipcode") && <TableCell style={styles.tableCellHeader}>Zipcode</TableCell>}
                {selectedColumns.includes("communicationPreference") && <TableCell style={styles.tableCellHeader}>Communication Preference</TableCell>}
                {selectedColumns.includes("recognitionPreference") && <TableCell style={styles.tableCellHeader}>Recognition Preference</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {grantorsData.map((grantor) => (
                <TableRow key={grantor.id}>
                  {selectedColumns.includes("name") && <TableCell style={styles.tableCell}>{grantor.organization.name}</TableCell>}
                  {selectedColumns.includes("type") && <TableCell style={styles.tableCell}>{grantor.type}</TableCell>}
                  {selectedColumns.includes("addressLine1") && <TableCell style={styles.tableCell}>{grantor.organization.address.addressLine1}</TableCell>}
                  {selectedColumns.includes("addressLine2") && <TableCell style={styles.tableCell}>{grantor.organization.address.addressLine2}</TableCell>}
                  {selectedColumns.includes("city") && <TableCell style={styles.tableCell}>{grantor.organization.address.city}</TableCell>}
                  {selectedColumns.includes("state") && <TableCell style={styles.tableCell}>{grantor.organization.address.state}</TableCell>}
                  {selectedColumns.includes("zipcode") && <TableCell style={styles.tableCell}>{grantor.organization.address.zipCode}</TableCell>}
                  {selectedColumns.includes("communicationPreference") && <TableCell style={styles.tableCell}>{grantor.communicationPreference}</TableCell>}
                  {selectedColumns.includes("recognitionPreference") && <TableCell style={styles.tableCell}>{grantor.recognitionPreference}</TableCell>}
                </TableRow>
              ))}
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