"use client";
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Grid,
  Paper,
  Divider,
  Box,
  Typography,
  CircularProgress,
  AlertColor
} from '@mui/material';

interface Grantor {
  id: string;
  organization: {
    name: string;
  };
}

interface GrantFormData {
  grantorId: string;
  name: string;
  status: string;
  amountRequested: number;
  amountAwarded: number;
  purpose: string;
  startDate: string;
  endDate: string;
  isMultipleYears: boolean;
  quarter: string;
  acknowledgementSent: boolean;
  fundingArea: string;
  proposalDueDate: string;
  applicationType: string;
  internalOwner: string;
  useArea: string;
  isEligibleForRenewal: boolean;
  awardNotificationDate?: string;
  proposalSummary?: string;
  proposalSubmissionDate?: string;
  fundingRestriction?: string;
  matchingRequirement?: string;
  renewalApplicationDate?: string;
  renewalAwardStatus?: string;
}

const GrantAddPage = () => {
  // Form state
  const [formData, setFormData] = useState<GrantFormData>({
    grantorId: '',
    name: '',
    status: 'Pending',
    amountRequested: 0,
    amountAwarded: 0,
    purpose: '',
    startDate: '',
    endDate: '',
    isMultipleYears: false,
    quarter: '1',
    acknowledgementSent: false,
    fundingArea: 'General',
    proposalDueDate: '',
    applicationType: 'New',
    internalOwner: '',
    useArea: '',
    isEligibleForRenewal: false
  });

  // Grantor modal state
  const [grantorModalOpen, setGrantorModalOpen] = useState(false);
  const [newGrantor, setNewGrantor] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    link: ''
  });

  const [grantorList, setGrantorList] = useState<Grantor[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingGrantors, setLoadingGrantors] = useState(false);

  // Status notification
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as AlertColor
  });

  // Load grantors on component mount
  useEffect(() => {
    fetchGrantors();
  }, []);

  const fetchGrantors = async () => {
    try {
      setLoadingGrantors(true);
      const response = await fetch('/api/admin/grantors/get');
      const result = await response.json();

      if (response.ok && Array.isArray(result.data)) {
        setGrantorList(result.data);
      } else {
        console.error('Failed to fetch grantors:', result);
        setGrantorList([]);
        throw new Error(result.message || 'Failed to fetch grantors');
      }
    } catch (error) {
      console.error('Error fetching grantors:', error);
      showSnackbar('Error fetching grantors', 'error');
      setGrantorList([]);
    } finally {
      setLoadingGrantors(false);
    }
  };

  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (field: keyof GrantFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGrantorChange = (field: keyof typeof newGrantor, value: string) => {
    setNewGrantor(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof GrantFormData)[] = [
      'grantorId', 'name', 'status', 'amountRequested',
      'purpose', 'startDate', 'endDate', 'quarter',
      'fundingArea', 'proposalDueDate', 'applicationType',
      'internalOwner', 'useArea'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      showSnackbar(`Missing required fields: ${missingFields.join(', ')}`, 'error');
      return false;
    }

    if (isNaN(formData.amountRequested) || formData.amountRequested <= 0) {
      showSnackbar('Amount requested must be a positive number', 'error');
      return false;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      showSnackbar('End date must be after start date', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Prepare the data to match backend expectations
      const submissionData = {
        ...formData,
        amountRequested: Number(formData.amountRequested),
        amountAwarded: Number(formData.amountAwarded),
        isMultipleYears: Boolean(formData.isMultipleYears),
        acknowledgementSent: Boolean(formData.acknowledgementSent),
        isEligibleForRenewal: Boolean(formData.isEligibleForRenewal)
      };

      const response = await fetch('/api/admin/grants/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add grant');
      }

      showSnackbar('Grant added successfully!', 'success');
      resetForm();
    } catch (error) {
      console.error('Error adding grant:', error);
      showSnackbar(error instanceof Error ? error.message : 'Failed to add grant', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGrantor = async () => {
    if (!newGrantor.name || !newGrantor.email) {
      showSnackbar('Grantor name and email are required', 'error');
      return;
    }

    try {
      setLoading(true);

      const nameParts = newGrantor.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      const grantorData = {
        type: "Foundation",
        websiteLink: newGrantor.link || null,
        communicationPreference: "Email",
        recognitionPreference: "",
        internalRelationshipManager: "",
        organization: {
          name: newGrantor.name,
          emailAddress: newGrantor.email,
        },
        representative: {
          positionTitle: newGrantor.title || "Representative",
          person: {
            firstName: firstName,
            lastName: lastName,
            emailAddress: newGrantor.email,
          }
        },
        status: true
      };

      const response = await fetch('/api/admin/grantors/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grantorData)
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Server response:', result);
        throw new Error(result.message || result.error || `Failed to add grantor: ${response.status}`);
      }

      showSnackbar('Grantor added successfully!', 'success');
      setGrantorModalOpen(false);
      setNewGrantor({
        name: '', title: '', email: '', phone: '', address: '', link: ''
      });

      await fetchGrantors();
      if (result.id) {
        handleChange('grantorId', result.id);
      }
    } catch (error) {
      console.error('Error adding grantor:', error);
      showSnackbar(error instanceof Error ? error.message : 'Failed to add grantor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      grantorId: '',
      name: '',
      status: 'Pending',
      amountRequested: 0,
      amountAwarded: 0,
      purpose: '',
      startDate: '',
      endDate: '',
      isMultipleYears: false,
      quarter: '1',
      acknowledgementSent: false,
      fundingArea: 'General',
      proposalDueDate: '',
      applicationType: 'New',
      internalOwner: '',
      useArea: '',
      isEligibleForRenewal: false
    });
  };

  return (
      <Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
        <Typography variant="h4" gutterBottom>Add New Grant</Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Basic Information Section */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>Basic Information</Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Select Grantor *</InputLabel>
                  <Select
                      value={formData.grantorId}
                      onChange={(e) => handleChange('grantorId', e.target.value)}
                      label="Select Grantor *"
                      disabled={loadingGrantors}
                  >
                    {loadingGrantors ? (
                        <MenuItem value="">Loading...</MenuItem>
                    ) : (
                        grantorList.length > 0 ? (
                            grantorList.map((g) => (
                                <MenuItem key={g.id} value={g.id}>
                                  {g.organization.name}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem value="">No grantors available</MenuItem>
                        )
                    )}
                  </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    onClick={() => setGrantorModalOpen(true)}
                    sx={{ mt: 1, mb: 2 }}
                    disabled={loading}
                >
                  Add New Grantor
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                    label="Grant Name *"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    error={!formData.name}
                    helperText={!formData.name ? "Required field" : ""}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Grant Status *</InputLabel>
                  <Select
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      label="Grant Status *"
                      required
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                    <MenuItem value="In Review">In Review</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                    label="Amount Requested ($) *"
                    value={formData.amountRequested || ''}
                    onChange={(e) => handleChange('amountRequested', parseFloat(e.target.value) || 0)}
                    fullWidth
                    margin="normal"
                    type="number"
                    required
                    error={!formData.amountRequested}
                    helperText={!formData.amountRequested ? "Required field" : ""}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                    label="Amount Awarded ($)"
                    value={formData.amountAwarded || ''}
                    onChange={(e) => handleChange('amountAwarded', parseFloat(e.target.value) || 0)}
                    fullWidth
                    margin="normal"
                    type="number"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                    label="Grant Purpose *"
                    value={formData.purpose}
                    onChange={(e) => handleChange('purpose', e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    required
                    error={!formData.purpose}
                    helperText={!formData.purpose ? "Required field" : ""}
                />
              </Grid>

              {/* Add the missing required fields */}
              <Grid item xs={12} md={6}>
                <TextField
                    label="Internal Owner *"
                    value={formData.internalOwner}
                    onChange={(e) => handleChange('internalOwner', e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    error={!formData.internalOwner}
                    helperText={!formData.internalOwner ? "Required field" : ""}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                    label="Use Area *"
                    value={formData.useArea}
                    onChange={(e) => handleChange('useArea', e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    error={!formData.useArea}
                    helperText={!formData.useArea ? "Required field" : ""}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Dates Section */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>Dates</Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                    label="Start Date *"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                    required
                    error={!formData.startDate}
                    helperText={!formData.startDate ? "Required field" : ""}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                    label="End Date *"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                    required
                    error={!formData.endDate}
                    helperText={!formData.endDate ? "Required field" : ""}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                    control={
                      <Checkbox
                          checked={formData.isMultipleYears}
                          onChange={(e) => handleChange('isMultipleYears', e.target.checked)}
                      />
                    }
                    label="Multi-Year Grant"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Quarter *</InputLabel>
                  <Select
                      value={formData.quarter}
                      onChange={(e) => handleChange('quarter', e.target.value)}
                      label="Quarter *"
                      required
                  >
                    <MenuItem value="1">Q1</MenuItem>
                    <MenuItem value="2">Q2</MenuItem>
                    <MenuItem value="3">Q3</MenuItem>
                    <MenuItem value="4">Q4</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                    label="Proposal Due Date *"
                    type="date"
                    value={formData.proposalDueDate}
                    onChange={(e) => handleChange('proposalDueDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                    required
                    error={!formData.proposalDueDate}
                    helperText={!formData.proposalDueDate ? "Required field" : ""}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Application Type *</InputLabel>
                  <Select
                      value={formData.applicationType}
                      onChange={(e) => handleChange('applicationType', e.target.value)}
                      label="Application Type *"
                      required
                  >
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="Renewal">Renewal</MenuItem>
                    <MenuItem value="Continuation">Continuation</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Funding Area *</InputLabel>
                  <Select
                      value={formData.fundingArea}
                      onChange={(e) => handleChange('fundingArea', e.target.value)}
                      label="Funding Area *"
                      required
                  >
                    <MenuItem value="General">General</MenuItem>
                    <MenuItem value="Education">Education</MenuItem>
                    <MenuItem value="Healthcare">Healthcare</MenuItem>
                    <MenuItem value="Arts">Arts</MenuItem>
                    <MenuItem value="Environment">Environment</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                    control={
                      <Checkbox
                          checked={formData.acknowledgementSent}
                          onChange={(e) => handleChange('acknowledgementSent', e.target.checked)}
                      />
                    }
                    label="Acknowledgement Sent"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                    control={
                      <Checkbox
                          checked={formData.isEligibleForRenewal}
                          onChange={(e) => handleChange('isEligibleForRenewal', e.target.checked)}
                      />
                    }
                    label="Eligible for Renewal"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Optional Fields Section */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>Additional Information</Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                    label="Award Notification Date"
                    type="date"
                    value={formData.awardNotificationDate || ''}
                    onChange={(e) => handleChange('awardNotificationDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                    label="Proposal Submission Date"
                    type="date"
                    value={formData.proposalSubmissionDate || ''}
                    onChange={(e) => handleChange('proposalSubmissionDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                    label="Proposal Summary"
                    value={formData.proposalSummary || ''}
                    onChange={(e) => handleChange('proposalSummary', e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                    label="Funding Restrictions"
                    value={formData.fundingRestriction || ''}
                    onChange={(e) => handleChange('fundingRestriction', e.target.value)}
                    fullWidth
                    margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                    label="Matching Requirements"
                    value={formData.matchingRequirement || ''}
                    onChange={(e) => handleChange('matchingRequirement', e.target.value)}
                    fullWidth
                    margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                    label="Renewal Application Date"
                    type="date"
                    value={formData.renewalApplicationDate || ''}
                    onChange={(e) => handleChange('renewalApplicationDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                    label="Renewal Award Status"
                    value={formData.renewalAwardStatus || ''}
                    onChange={(e) => handleChange('renewalAwardStatus', e.target.value)}
                    fullWidth
                    margin="normal"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  size="large"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Submitting...' : 'Submit Grant'}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Grantor Modal */}
        <Dialog open={grantorModalOpen} onClose={() => !loading && setGrantorModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add New Grantor</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                    label="Grantor Name *"
                    value={newGrantor.name}
                    onChange={(e) => handleGrantorChange('name', e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    error={!newGrantor.name}
                    helperText={!newGrantor.name ? "Required field" : ""}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                    label="Title"
                    value={newGrantor.title}
                    onChange={(e) => handleGrantorChange('title', e.target.value)}
                    fullWidth
                    margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                    label="Email *"
                    value={newGrantor.email}
                    onChange={(e) => handleGrantorChange('email', e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    error={!newGrantor.email}
                    helperText={!newGrantor.email ? "Required field" : ""}
                    type="email"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                    label="Phone"
                    value={newGrantor.phone}
                    onChange={(e) => handleGrantorChange('phone', e.target.value)}
                    fullWidth
                    margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                    label="Address"
                    value={newGrantor.address}
                    onChange={(e) => handleGrantorChange('address', e.target.value)}
                    fullWidth
                    margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                    label="Website"
                    value={newGrantor.link}
                    onChange={(e) => handleGrantorChange('link', e.target.value)}
                    fullWidth
                    margin="normal"
                    type="url"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGrantorModalOpen(false)} disabled={loading}>Cancel</Button>
            <Button
                onClick={handleAddGrantor}
                variant="contained"
                color="primary"
                disabled={loading || !newGrantor.name || !newGrantor.email}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Adding...' : 'Add Grantor'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert
              onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
              severity={snackbar.severity}
              variant="filled"
              sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
  );
};

export default GrantAddPage;