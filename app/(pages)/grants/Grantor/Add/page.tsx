"use client";

import {
    Box,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Checkbox,
    FormControlLabel,
    TextField,
    Button,
    Modal,
    InputAdornment,
} from "@mui/material";
import React, { useState } from "react";

const GrantAddPage = () => {
    const [grantor, setGrantor] = useState("");
    const [grantName, setGrantName] = useState("");
    const [amountRequested, setAmountRequested] = useState("");
    const [grantStatus, setGrantStatus] = useState("");
    const [grantPurpose, setGrantPurpose] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [multiYear, setMultiYear] = useState(false);
    const [quarter, setQuarter] = useState("");
    const [proposalDate, setProposalDate] = useState("");
    const [notificationDate, setNotificationDate] = useState("");

    // Modal states
    const [openGrantorModal, setOpenGrantorModal] = useState(false);
    const [openPurposeModal, setOpenPurposeModal] = useState(false);
    const [newGrantorName, setNewGrantorName] = useState("");
    const [newGrantorTitle, setNewGrantorTitle] = useState("");
    const [newGrantorAddress, setNewGrantorAddress] = useState("");
    const [newGrantorEmail, setNewGrantorEmail] = useState("");
    const [newGrantorPhone, setNewGrantorPhone] = useState("");
    const [newGrantorLink, setNewGrantorLink] = useState("");
    const [newGrantPurpose, setNewGrantPurpose] = useState("");

    const handleSubmit = () => {
        console.log({
            grantor,
            grantName,
            amountRequested,
            grantStatus,
            grantPurpose,
            startDate,
            endDate,
            multiYear,
            quarter,
            proposalDate,
            notificationDate,
        });
    };

    const handleOpenGrantorModal = () => {
        setOpenGrantorModal(true);
    };

    const handleCloseGrantorModal = () => {
        setOpenGrantorModal(false);
    };

    const handleAddGrantor = () => {
        console.log("New Grantor:", newGrantorName);
        setGrantor(newGrantorName);
        setNewGrantorName("");
        setNewGrantorTitle("");
        setNewGrantorEmail("");
        setNewGrantorPhone("");
        setNewGrantorAddress("");
        setNewGrantorLink("");
        handleCloseGrantorModal();
    };

    const handleOpenPurposeModal = () => {
        setOpenPurposeModal(true);
    };

    const handleClosePurposeModal = () => {
        setOpenPurposeModal(false);
    };

    const handleAddGrantPurpose = () => {
        console.log("New Grant Purpose:", newGrantPurpose);
        setGrantPurpose(newGrantPurpose);
        setNewGrantPurpose("");
        handleClosePurposeModal();
    };

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 600,
                mx: "auto",
                p: 3,
                mt: 1,
                boxShadow: 3,
                borderRadius: 2,
            }}
        >
            <Typography variant="h4" gutterBottom textAlign="center">
                Add a New Grant
            </Typography>

            <Box sx={{ mb: 2 }}>
                <InputLabel id="grantor-label">Select Grantor</InputLabel>
                <Select
                    labelId="grantor-label"
                    value={grantor}
                    onChange={(e) => setGrantor(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="" disabled>
                        Select Grantor
                    </MenuItem>
                    <MenuItem
                        value="new"
                        onClick={handleOpenGrantorModal}
                        style={{ pointerEvents: "auto" }}
                    >
                        Add New Grantor
                    </MenuItem>
                </Select>
            </Box>

            <TextField
                label="Grant Name"
                value={grantName}
                onChange={(e) => setGrantName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            />

            <TextField
                label="Amount Requested"
                type="number"
                value={amountRequested}
                onChange={(e) => setAmountRequested(e.target.value)}
                fullWidth
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>, // Add dollar sign
                }}
                sx={{ mb: 2 }}
            />

            <InputLabel id="grant-status-label">Grant Status</InputLabel>
            <Select
                labelId="grant-status-label"
                value={grantStatus}
                onChange={(e) => setGrantStatus(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            >
                <MenuItem value="LOI Submitted">LOI Submitted</MenuItem>
                <MenuItem value="Proposal Submitted">Proposal Submitted</MenuItem>
                <MenuItem value="Awarded">Awarded</MenuItem>
                <MenuItem value="Declined">Declined</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
            </Select>

            <InputLabel id="grant-purpose-label">Grant Purpose</InputLabel>
            <Select
                labelId="grant-purpose-label"
                value={grantPurpose}
                onChange={(e) => setGrantPurpose(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            >
                <MenuItem value="" disabled>
                    Select Grant Purpose
                </MenuItem>
                <MenuItem value="After-School Tutoring Program">
                    After-School Tutoring Program
                </MenuItem>
                <MenuItem value="Summer Program">Summer Program</MenuItem>
                <MenuItem value="Family & Community Engagement (FACE)">
                    Family & Community Engagement (FACE)
                </MenuItem>
                <MenuItem value="Nutrition and Meal Programs">
                    Nutrition and Meal Programs
                </MenuItem>
                <MenuItem value="Community Safety Initiatives">
                    Community Safety Initiatives
                </MenuItem>
                <MenuItem
                    value="new"
                    onClick={handleOpenPurposeModal}
                    style={{ pointerEvents: "auto" }}
                >
                    Add New Grant Purpose
                </MenuItem>
            </Select>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <TextField
                    label="Grant Period Start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "48%" }}
                />
                <TextField
                    label="Grant Period End"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "48%" }}
                />
            </Box>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={multiYear}
                        onChange={(e) => setMultiYear(e.target.checked)}
                    />
                }
                label="Multi-Year"
            />

            <InputLabel id="quarter-label">Quarter</InputLabel>
            <Select
                labelId="quarter-label"
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            >
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
            </Select>

            <TextField
                label="Proposal Submission Date"
                type="date"
                value={proposalDate}
                onChange={(e) => setProposalDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ mb: 2 }}
            />

            <TextField
                label="Award Notification Date"
                type="date"
                value={notificationDate}
                onChange={(e) => setNotificationDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ mb: 2 }}
            />

            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
            </Button>

            {/* Modal for adding new grantor */}
            <Modal
                open={openGrantorModal}
                onClose={handleCloseGrantorModal}
                aria-labelledby="add-grantor-modal-title"
                aria-describedby="add-grantor-modal-description"
            >
                <Box
                    sx={{
                        width: 400,
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        gap: 1,
                        p: 4,
                        mx: "auto",
                        mt: "20%",
                    }}
                >
                    <Typography id="add-grantor-modal-title" variant="h6" component="h2">
                        Add New Grantor
                    </Typography>
                    <TextField
                        label="Primary Contact Name"
                        value={newGrantorName}
                        onChange={(e) => setNewGrantorName(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        type="text"
                    />
                    <TextField
                        label="Contact Title"
                        value={newGrantorTitle}
                        onChange={(e) => setNewGrantorTitle(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        type="text"
                    />
                    <TextField
                        label="Email Address"
                        value={newGrantorEmail}
                        onChange={(e) => setNewGrantorEmail(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        type="email"
                    />
                    <TextField
                        label="Phone Number"
                        value={newGrantorPhone}
                        onChange={(e) => setNewGrantorPhone(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        type="tel"
                    />
                    <TextField
                        label="Mailing Address"
                        value={newGrantorAddress}
                        onChange={(e) => setNewGrantorAddress(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        type="text"
                    />
                    <TextField
                        label="Website Link"
                        value={newGrantorLink}
                        onChange={(e) => setNewGrantorLink(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        type="url"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddGrantor}
                    >
                        Add Grantor
                    </Button>
                </Box>
            </Modal>

            {/* Modal for adding new grant purpose */}
            <Modal
                open={openPurposeModal}
                onClose={handleClosePurposeModal}
                aria-labelledby="add-purpose-modal-title"
                aria-describedby="add-purpose-modal-description"
            >
                <Box
                    sx={{
                        width: 400,
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        gap: 1,
                        p: 4,
                        mx: "auto",
                        mt: "20%",
                    }}
                >
                    <Typography id="add-purpose-modal-title" variant="h6" component="h2">
                        Add New Grant Purpose
                    </Typography>
                    <TextField
                        label="Grant Purpose Name"
                        value={newGrantPurpose}
                        onChange={(e) => setNewGrantPurpose(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddGrantPurpose}
                    >
                        Add Grant Purpose
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default GrantAddPage;
