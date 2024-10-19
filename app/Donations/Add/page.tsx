"use client";
import {
  Checkbox, 
  Box, 
  TextField, 
  Stack, Button, 
  MenuItem, 
  InputAdornment,
  Table,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableFooter,
  IconButton,
  Select,
} from "@mui/material";
import * as React from 'react';
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Link from "next/link";
import { useState } from "react";
import { donors, Donation } from "../../utils/donationTestData";

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

export default function AddDonation() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<Donation[]>(donors);
  const [searched, setSearched] = useState<string>("");

  const requestSearch = (searchedVal: string) => {
    const filteredRows = donors.filter((row) =>
      row.donor.name.toLowerCase().includes(searchedVal.toLowerCase())
    );
    setRows(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    setRows(donors);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const renderDonationRow = (donor: Donation) => (
    <TableRow key={donor.id}>
      <TableCell style={styles.tableCell}>
        <Button
            sx={{ marginRight: 5 }}
            variant="contained"
            onClick={() => {
                setDonorData({
                    firstName: donor.firstName || '',
                    lastName: donor.lastName || '',
                    organization: donor.organization || '',
                    email: donor.email || '',
                    phone: donor.phone || '',
                    address: donor.address || '',
                    donorType: donor.donorType || '',
                    contactMethod: donor.contactMethod || '',
                    donorStatus: donor.donorStatus || 'Existing',
                    notes: donor.notes || '',
                });
            }}
        >
            Select
        </Button>
        <Link href={`/Donations/Detail/${donor.id}`} className="text-blue-500">
          {donor.donor.name.trim()}
          {donor.donor.phone}
        </Link>
      </TableCell>
    </TableRow>
  );






  const [donorData, setDonorData] = React.useState({
    firstName: '',
    lastName: '',
    organization: '',
    email: '',
    phone: '',
    address: '',
    donorType: 'Individual',
    contactMethod: '',
    donorStatus: 'Anonymous',
    notes: '',
  });

  const [donationData, setDonationData] = React.useState({
    date: '',
    amount: '',
    donationType: '',
    paymentMethod: '',
    campaignName: '',
    designation: '',
    frequency: '',
    source: '',
    matched: 'False',
  });

  const { donorType, donorStatus, contactMethod } = donorData;
  const { donationType, frequency, source } = donationData;

  const handleDonorChange = (event: any) => {
    const { name, value } = event.target;
    setDonorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDonationChange = (event: any) => {
    const { name, value } = event.target;
    setDonationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const donorResponse = await fetch('/api/donors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donorData), 
      });

      if (donorResponse.ok) {
        const result = await donorResponse.json();
        console.log('Donor successfully added:', result);
      } else {
        console.error('Failed to add donor');
      }
    } catch (error) {
      console.error('Error submitting donor data:', error);
    }

    try {
      const donationResponse = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      if (donationResponse.ok) {
        const result = await donationResponse.json();
        console.log('Donation successfully added:', result);
      } else {
        console.error('Failed to add donation');
      }
    } catch (error) {
      console.error('Error submitting donation data:', error);
    }
  };

  const checkbox = { inputProps: { 'aria-label': 'Checkbox demo' } };
  
  return (
    <Box>
      <Box>
        <Select
          name="donorStatus"
          value={donorStatus}
          onChange={handleDonorChange}
          displayEmpty
          sx={{ margin: 5 }}
        >
          <MenuItem value="" disabled>Select Donor Status</MenuItem>
          <MenuItem value="Anonymous">Anonymous</MenuItem>
          <MenuItem value="Existing">Existing</MenuItem>
          <MenuItem value="New">New</MenuItem>
        </Select>
      </Box>

      {donorStatus !== 'Anonymous' && (
      <Box sx={{ paddingLeft: 5, fontSize: 24 }}>Donor Info</Box>
      )}

{donorStatus === 'Existing' && (
        <Box sx={{ p: 5 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 5 }}
            useFlexGap
            sx={{ flexWrap: 'wrap' }}
          >
            <Box sx={{ width: '250px' }}>
              <TextField name="phone" id="phone" label="Phone Number" variant="outlined" fullWidth onChange={handleDonorChange} />
            </Box>
            <Box sx={{ width: '250px' }}>
              <TextField name="firstName" id="firstName" label="First Name" variant="outlined" fullWidth onChange={handleDonorChange} />
            </Box>
            <Box sx={{ width: '250px' }}>
              <TextField name="lastName" id="lastName" label="Last Name" variant="outlined" fullWidth onChange={handleDonorChange} />
            </Box>
            <Box sx={{ width: '250px' }}>
              <TextField name="email" id="email" label="Email" variant="outlined" fullWidth onChange={handleDonorChange} />
            </Box>
          </Stack>
        </Box>
      )}

      {donorStatus === "Existing" && (
        <Box sx={{ p: 5 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Donor Lookup</Typography>
  
        {/* Search Filter */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Search by Donor Name"
            variant="outlined"
            value={searched}
            onChange={(e) => {
              setSearched(e.target.value);
              requestSearch(e.target.value);
            }}
            fullWidth
          />
          <Button variant="outlined" onClick={cancelSearch}>
            Clear
          </Button>
        </Stack>
  
        <Table style={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell style={styles.tableCellHeader}>Name</TableCell>
              <TableCell style={styles.tableCellHeader}>Phone</TableCell>
              <TableCell style={styles.tableCellHeader}>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.length > 0 ? (
              currentRows.map((donor) => renderDonationRow(donor))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No donors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={({ count, page, rowsPerPage, onPageChange }) => (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={(event) => onPageChange(event, page - 1)}
                      disabled={page === 0}
                    >
                      <KeyboardArrowLeft />
                    </IconButton>
                    <IconButton
                      onClick={(event) => onPageChange(event, page + 1)}
                      disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    >
                      <KeyboardArrowRight />
                    </IconButton>
                  </Box>
                )}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Box>
      )}

      {donorStatus === 'New' && (
        <>
          <Box sx={{ paddingLeft: 5, paddingTop: 5}}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 5 }}
              useFlexGap
              sx={{ flexWrap: 'wrap' }}
            >
              <Box sx={{ width: '250px' }}>
                <Select
                  name="donorType"
                  value={donorType}
                  onChange={handleDonorChange}
                  displayEmpty
                  sx={{ width: '250px' }}
                >
                  <MenuItem value="" disabled>Select Donor Type</MenuItem>
                  <MenuItem value="Individual">Individual</MenuItem>
                  <MenuItem value="Corporate">Corporate</MenuItem>
                  <MenuItem value="Foundation">Foundation</MenuItem>
                </Select>
              </Box>
              <Box sx={{ width: '250px' }}>
                <Select
                  name="contactMethod"
                  value={contactMethod}
                  onChange={handleDonorChange}
                  displayEmpty
                  sx={{ width: '250px' }}
                >
                  <MenuItem value="" disabled>Contact Method</MenuItem>
                  <MenuItem value="Email">Email</MenuItem>
                  <MenuItem value="Phone">Phone</MenuItem>
                  <MenuItem value="Mail">Mail</MenuItem>
                </Select>
              </Box>
            </Stack>
          </Box>
          <Box sx={{ p: 5 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 5 }}
              useFlexGap
              sx={{ flexWrap: 'wrap' }}
            >
              <Box sx={{ width: '250px' }}>
                <TextField name="phone" id="phone" label="Phone Number" variant="outlined" fullWidth onChange={handleDonorChange} />
              </Box>
              {donorData.donorType === 'Individual' && (
                <>
                  <Box sx={{ width: '250px' }}>
                    <TextField name="firstName" label="First Name" variant="outlined" fullWidth onChange={handleDonorChange} />
                  </Box>
                  <Box sx={{ width: '250px' }}>
                    <TextField name="lastName" label="Last Name" variant="outlined" fullWidth onChange={handleDonorChange} />
                  </Box>
                </>
              )}

              {(donorData.donorType === 'Corporate' || donorData.donorType === 'Foundation') && (
                <>
                  <Box sx={{ width: '250px' }}>
                    <TextField name="organization" label="Organization" variant="outlined" fullWidth onChange={handleDonorChange} />
                  </Box>
                </>
              )}

              <Box sx={{ width: '250px' }}>
                <TextField name="email" id="email" label="Email" variant="outlined" fullWidth onChange={handleDonorChange} />
              </Box>
              <Box sx={{ width: '250px' }}>
                <TextField name="address" id="address" label="Address" variant="outlined" fullWidth onChange={handleDonorChange} />
              </Box>
              <Box sx={{ width: '250px' }}>
                <TextField name="city" id="city" label="City" variant="outlined" fullWidth onChange={handleDonorChange} />
              </Box>
              <Box sx={{ width: '250px' }}>
                <TextField name="state" id="state" label="State" variant="outlined" fullWidth onChange={handleDonorChange} />
              </Box>
              <Box sx={{ width: '250px' }}>
                <TextField name="zip" id="zip" label="Zip" variant="outlined" fullWidth onChange={handleDonorChange} />
              </Box>
              <Box sx={{ width: '100%' }}>
                <TextField name="note" id="note" label="Donor Note" variant="outlined" fullWidth onChange={handleDonorChange} />
              </Box>
            </Stack>
          </Box>
        </>
      )}

      <Box sx={{ paddingLeft: 5, fontSize: 24 }}>Donation Info</Box>

      <Box sx={{ p: 5 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 5 }}
          useFlexGap
          sx={{ flexWrap: 'wrap' }}
        >
          <Box sx={{ width: '250px' }}>
            <Select
              name="donationType"
              value={donationType}
              onChange={handleDonationChange}
              displayEmpty
              sx={{ width: '250px' }}
            >
              <MenuItem value="" disabled>Donation Type</MenuItem>
              <MenuItem value="oneTime">One-Time</MenuItem>
              <MenuItem value="recurring">Recurring</MenuItem>
              <MenuItem value="pledge">Pledge</MenuItem>
              <MenuItem value="inKind">In-Kind</MenuItem>
            </Select>
          </Box>
          {donationType === 'recurring' && (
            <Box sx={{ width: '250px' }}>
              <Select
                name="frequency"
                value={frequency}
                onChange={handleDonationChange}
                displayEmpty
                sx={{ width: '250px' }}
              >
                <MenuItem value="" disabled>Recurring Frequency</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="annually">Annually</MenuItem>
              </Select>
            </Box>
          )}
          <Box sx={{ width: '250px' }}>
          <TextField
              id="date"
              label="Donation Date"
              type="date"
              variant="outlined"
              fullWidth
              onChange={handleDonationChange}
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </Box>
          <Box sx={{ width: '250px' }}>
            <TextField
              name="amount"
              id="amount"
              label="Amount"
              variant="outlined"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
              }}
              onChange={handleDonationChange}
            />
          </Box>
          <Box sx={{ width: '250px' }}>
            <TextField name="method" id="method" label="Method" variant="outlined" fullWidth onChange={handleDonationChange} />
          </Box>
          <Box sx={{ width: '250px' }}>
            <TextField name="campaign" id="campaign" label="Campaign Name" variant="outlined" fullWidth onChange={handleDonationChange} />
          </Box>
          <Box sx={{ width: '250px' }}>
            <TextField name="designation" id="designation" label="Fund Designation" variant="outlined" fullWidth onChange={handleDonationChange} />
          </Box>
          <Box sx={{ width: '250px' }}>
            <Select
              name="source"
              value={source}
              onChange={handleDonationChange}
              displayEmpty
              sx={{ width: '250px' }}
            >
              <MenuItem value="" disabled>Source</MenuItem>
              <MenuItem value="website">Website</MenuItem>
              <MenuItem value="socialMedia">Social Media</MenuItem>
              <MenuItem value="event">Event</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="mail">Direct Mail</MenuItem>
              <MenuItem value="referral">Referral</MenuItem>
            </Select>
          </Box>
          <Box sx={{ width: '250px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Donation Matched</span>
            <Checkbox
              {...checkbox}
              checked={donationData.matched === 'True'}
              onChange={(e) =>
                setDonationData((prev) => ({
                  ...prev,
                  matched: e.target.checked ? 'True' : 'False',
                }))
              }
            />
          </Box>
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 5 }}>
        <Button variant="contained" onClick={handleSubmit}>Add Donation</Button>
      </Box>
    </Box>
  );
}