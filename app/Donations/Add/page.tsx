"use client";
import * as React from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Checkbox, Box, TextField, Stack, Button, MenuItem, InputAdornment } from '@mui/material';

export default function AddDonation() {
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
                <TextField id="phone" label="Phone Number" variant="outlined" fullWidth onChange={handleDonorChange} />
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
                <TextField id="email" label="Email" variant="outlined" fullWidth onChange={handleDonorChange} />
              </Box>
              <Box sx={{ width: '250px' }}>
                <TextField id="address" label="Address" variant="outlined" fullWidth onChange={handleDonorChange} />
              </Box>
              <Box sx={{ width: '250px' }}>
                <TextField id="city" label="City" variant="outlined" fullWidth onChange={handleDonorChange} />
              </Box>
              <Box sx={{ width: '250px' }}>
                <TextField id="state" label="State" variant="outlined" fullWidth onChange={handleDonorChange} />
              </Box>
              <Box sx={{ width: '250px' }}>
                <TextField id="zip" label="Zip" variant="outlined" fullWidth onChange={handleDonorChange} />
              </Box>
              <Box sx={{ width: '100%' }}>
                <TextField id="note" label="Donor Note" variant="outlined" fullWidth onChange={handleDonorChange} />
              </Box>
            </Stack>
          </Box>
        </>
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
              <TextField id="phone" label="Phone Number" variant="outlined" fullWidth onChange={handleDonorChange} />
            </Box>
            <Box sx={{ width: '250px' }}>
              <TextField id="firstName" label="First Name" variant="outlined" fullWidth onChange={handleDonorChange} />
            </Box>
            <Box sx={{ width: '250px' }}>
              <TextField id="lastName" label="Last Name" variant="outlined" fullWidth onChange={handleDonorChange} />
            </Box>
            <Box sx={{ width: '250px' }}>
              <TextField id="email" label="Email" variant="outlined" fullWidth onChange={handleDonorChange} />
            </Box>
          </Stack>
        </Box>
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
            <TextField id="method" label="Method" variant="outlined" fullWidth onChange={handleDonationChange} />
          </Box>
          <Box sx={{ width: '250px' }}>
            <TextField id="campaign" label="Campaign Name" variant="outlined" fullWidth onChange={handleDonationChange} />
          </Box>
          <Box sx={{ width: '250px' }}>
            <TextField id="designation" label="Fund Designation" variant="outlined" fullWidth onChange={handleDonationChange} />
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
            <Checkbox {...checkbox} defaultChecked id="matched" value="matched" sx={{}}/>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 5 }}>
        <Button variant="contained" onClick={handleSubmit}>Add Donation</Button>
      </Box>
    </Box>
  );
}
