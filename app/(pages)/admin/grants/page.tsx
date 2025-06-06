"use client";
import React, { useState, useEffect } from "react";
import type { Grant } from "@/prisma";
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
import Grid from "@mui/material/Grid";
import Link from "next/link"

const columns = [
  "grantor",
  "representative",
  "name",
  "status",
  "purpose",
  "startDate",
  "endDate",
  "awardNotificationDate",
  "amountAwarded",
  "amountRequested",
  "proposalDueDate",
  "proposalSubmissionDate",
];

const searchOptions = [
  "name",
  "status",
  "grantor"
];

export default function GrantsPage() {
  const [grantsData, setGrantsData] = useState<Grant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalCount, setTotalCount] = React.useState(0);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("");

  const fetchGrantsData = async () => {
    try {
      const response = await fetch(`/api/admin/grants/get?page=${page}&rowsPerPage=${rowsPerPage}&searchCriteria=${searchCriteria}&searchValue=${searchValue}`);
      const result = await response.json();
      setGrantsData(result.data);
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
      if (sessionStorage.getItem("page") !== "grantList") {
        sessionStorage.clear();
      }
      sessionStorage.setItem("page", "grantList");

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
    fetchGrantsData();
  }, [page, rowsPerPage, searchValue, searchCriteria]);

  if (loading) {
    return <CircularProgress style={styles.center} />
  }

  return (
    <Box>
      <Box>
        <Breadcrumbs style={styles.breadcrumb}>
          <Link href={"/"} style={{ textDecoration: 'underline', }}>Dashboard</Link>
          <Typography>Grants</Typography>
          <Typography>Grant List</Typography>
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
                {selectedColumns.includes("grantor") && <TableCell style={styles.tableCellHeader}>Grantor</TableCell>}
                {selectedColumns.includes("representative") && <TableCell style={styles.tableCellHeader}>Representative</TableCell>}
                {selectedColumns.includes("name") && <TableCell style={styles.tableCellHeader}>Name</TableCell>}
                {selectedColumns.includes("status") && <TableCell style={styles.tableCellHeader}>Status</TableCell>}
                {selectedColumns.includes("purpose") && <TableCell style={styles.tableCellHeader}>Purpose</TableCell>}
                {selectedColumns.includes("startDate") && <TableCell style={styles.tableCellHeader}>Start Date</TableCell>}
                {selectedColumns.includes("endDate") && <TableCell style={styles.tableCellHeader}>End Date</TableCell>}
                {selectedColumns.includes("awardNotificationDate") && <TableCell style={styles.tableCellHeader}>Award Notification Date</TableCell>}
                {selectedColumns.includes("amountAwarded") && <TableCell style={styles.tableCellHeader}>Amount Awarded</TableCell>}
                {selectedColumns.includes("amountRequested") && <TableCell style={styles.tableCellHeader}>Amount Requested</TableCell>}
                {selectedColumns.includes("proposalDueDate") && <TableCell style={styles.tableCellHeader}>Proposal Due Date</TableCell>}
                {selectedColumns.includes("proposalSubmissionDate") && <TableCell style={styles.tableCellHeader}>Proposal Submission Date</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {grantsData?.map((grant) => (
                <TableRow key={grant.id}>
{selectedColumns.includes("grantor") && grant.representativeGrant?.[0]?.representative?.grantor?.organization?.name ? (
  <TableCell style={styles.tableCell}>
    <Link href={`/admin/grants/grantor/detail/${grant.representativeGrant[0].representative.grantorId}`}>
      {grant.representativeGrant[0].representative.grantor.organization.name}
    </Link>
  </TableCell>
) : null}

{selectedColumns.includes("representative") && grant.representativeGrant?.[0]?.representative?.person?.firstName && grant.representativeGrant?.[0]?.representative?.person?.lastName ? (
  <TableCell style={styles.tableCell}>
    {grant.representativeGrant[0].representative.person.firstName} {grant.representativeGrant[0].representative.person.lastName}
  </TableCell>
) : null}
                  {selectedColumns.includes("name") && <TableCell style={styles.tableCell}><Link href={`/grants/detail/${grant.id}`}>{grant.name}</Link></TableCell>}
                  {selectedColumns.includes("status") && <TableCell style={styles.tableCell}>{grant.status}</TableCell>}
                  {selectedColumns.includes("purpose") && <TableCell style={styles.tableCell}>{grant.purpose}</TableCell>}
                  {selectedColumns.includes("startDate") && <TableCell style={styles.tableCell}>{new Date(grant.startDate).toLocaleDateString()}</TableCell>}
                  {selectedColumns.includes("endDate") && <TableCell style={styles.tableCell}>{new Date(grant.endDate).toLocaleDateString()}</TableCell>}
                  {selectedColumns.includes("awardNotificationDate") && <TableCell style={styles.tableCell}>{grant.awardNotificationDate ? new Date(grant.awardNotificationDate).toLocaleDateString() : "N/A"}</TableCell>}
                  {selectedColumns.includes("amountAwarded") && <TableCell style={styles.tableCell}>{"$" + grant.amountAwarded}</TableCell>}
                  {selectedColumns.includes("amountRequested") && <TableCell style={styles.tableCell}>{"$" + grant.amountRequested}</TableCell>}
                  {selectedColumns.includes("proposalDueDate") && <TableCell style={styles.tableCell}>{new Date(grant.proposalDueDate).toLocaleDateString()}</TableCell>}
                  {selectedColumns.includes("proposalSubmissionDate") && <TableCell style={styles.tableCell}>{grant.proposalSubmissionDate ? new Date(grant.proposalSubmissionDate).toLocaleDateString() : "N/A"}</TableCell>}
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
