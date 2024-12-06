"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import { statesChoices } from "@/app/components/formComponents/FormInputProps";
import { Box, TextField, Typography, InputAdornment, MenuItem, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  DonationState,
  DonationResponse,
  RequiredDonationState,
  DonorState,
  PersonState,
  AddressState,
  RequiredDonorPersonState,
  donorResponse,
} from "@/app/types/states";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DoNotDisturbOutlined } from "@mui/icons-material";

const donationTypes = ["One-Time", "Recurring", "Pledge", "In-Kind"];
const paymentMethods = ["Credit Card", "Check", "Bank Transfer", "Cash", "ACH", "PayPal", "Venmo", "Zelle"];
const recurringFrequencies = ["None", "Monthly", "Quarterly", "Annually"];
const donationSources = ["Website", "Social Media", "Event", "Email", "Direct Mail", "Referral"];
const donorModes = ["Anonymous", "New", "Existing"];
const donorTypes = ["Individual", "Corporate", "Foundation"];
const donorStatuses = ["Active", "Lapsed", "Major Donor", "First Time Donor"];
const donorCommPrefs = ["Email", "Mail", "Phone"];

export default function AddDonation() {
  const initialDonorState: DonorState = {
    type: "",
    communicationPreference: "",
    status: "",
    notes: "",
    isRetained: false,
    segment: null,
  };

  const initialPersonState: PersonState = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: "",
  };

  const initialAddressState: AddressState = {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    type: "",
  };

  const initialDonationState: DonationState = {
    type: "",
    amount: 0,
    item: "",
    paymentMethod: "",
    campaign: "",
    fundDesignation: "",
    date: new Date(),
    recurringFrequency: "None",
    source: "",
    isMatching: false,
    receiptSent: false,
    receiptNumber: "",
    isAnonymous: false,
    acknowledgementSent: false,
  };

  const initialRequiredErrorState = {
    firstName: false,
    lastName: false,
    emailAddress: false,
    addressLine1: false,
    city: false,
    zipCode: false,
    type: false,
    amount: false,
    item: false,
    campaign: false,
    fundDesignation: false,
    receiptNumber: false,
  };

  const [donor, setDonor] = useState<DonorState>(initialDonorState);
  const [person, setPerson] = useState<PersonState>(initialPersonState);
  const [address, setAddress] = useState<AddressState>(initialAddressState);
  const [donation, setDonation] = useState<DonationState>(initialDonationState);
  const [requiredError, setRequiredError] = useState(initialRequiredErrorState);
  const [donorMode, setDonorMode] = useState("Anonymous");

  const handleInput =
    <T,>(label: keyof T, setState: React.Dispatch<React.SetStateAction<T>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setRequiredError((prev) => ({ ...prev, [label]: value === "" }));
      setState((prev) => ({ ...prev, [label]: value }));
    };

  const handleSubmit = async () => {
    let donationWithDonorId;

    if (Object.values(requiredError).some((error) => error)) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      if (donorMode === "Existing") {
        const email = person.emailAddress.trim();

        // Send a GET request to fetch the donor based on the email
        const donorResponse = await fetch(`/api/v1/donors/email/${email}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!donorResponse.ok) {
          if (donorResponse.status === 404) {
            alert("No donor found with this email address.");
          } else {
            throw new Error("Failed to look up donor");
          }
          return;
        }

        const donorData = await donorResponse.json();
        console.log("Donor found:", donorData);
        const donorId = donorData.id;

        if (!donorId) {
          throw new Error("Donor ID is missing from the response.");
        }

        // Prepare donation data with the found donor ID
        donationWithDonorId = {
          ...donation,
          donor: { connect: { id: donorId } },
        };
      } else if (donorMode === "New") {
        const donorResponse = await fetch("/api/v1/donors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ donor, person, address }),
        });

        if (!donorResponse.ok) throw new Error("Failed to add donor");

        const donorResult = await donorResponse.json();
        const donorId = donorResult.id;

        donationWithDonorId = {
          ...donation,
          donor: { connect: { id: donorId } },
        };
      } else if (donorMode === "Anonymous") {
        const donationWithDonorId = {
          ...donation,
          donorId: null,
          isAnonymous: true,
        };
      }

      console.log("donationWithDonorId: ", donationWithDonorId);

      const donationResponse = await fetch("/api/v1/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationWithDonorId),
      });

      if (!donationResponse.ok) {
        console.log("Donation API response:", await donationResponse.text());
        throw new Error("Failed to add donation");
      }

      const donationResult = await donationResponse.json();
      console.log("Donation added:", donationResult);

      // Reset states after successful submission
      setDonor(initialDonorState);
      setPerson(initialPersonState);
      setAddress(initialAddressState);
      setDonation(initialDonationState);
      setRequiredError(initialRequiredErrorState);
    } catch (error) {
      console.error("Error submitting donation:", error);
    }
  };

  return (
    <Box>
      <Box sx={styles.container} component="form">
        <Box sx={styles.inputContainer}>
          <TextField
            sx={styles.textField}
            select
            id="select-donor-mode"
            label="Donor Mode"
            value={donorMode}
            onChange={(event) => setDonorMode(event.target.value)}
          >
            {donorModes.map((type, index) => (
              <MenuItem key={index} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
      {donorMode === "Existing" && (
        <>
          <Box sx={{ paddingLeft: 5, fontSize: 24 }}>Donor Info</Box>
          <Box sx={styles.container} component="form">
            <Box sx={styles.inputContainer}>
              <TextField
                sx={styles.textField}
                required={true}
                id="email"
                label="Email Address"
                value={person.emailAddress}
                onChange={handleInput("emailAddress", setPerson)}
              />
            </Box>
          </Box>
        </>
      )}

      {donorMode === "New" && (
        <>
          <Box sx={{ paddingLeft: 5, fontSize: 24 }}>Donor Info</Box>
          <Box sx={styles.container} component="form">
            <Box sx={styles.inputContainer}>
              <TextField
                sx={styles.textField}
                required={true}
                select
                id="select-type"
                label="Type"
                value={donor.type}
                onChange={handleInput("type", setDonor)}
              >
                {donorTypes.map((type, index) => (
                  <MenuItem key={index} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={styles.inputContainer}>
              <TextField
                sx={styles.textField}
                required={true}
                select
                id="select-communicationPreference"
                label="Communication Preference"
                value={donor.communicationPreference}
                onChange={handleInput("communicationPreference", setDonor)}
              >
                {donorCommPrefs.map((pref, index) => (
                  <MenuItem key={index} value={pref}>
                    {pref}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={styles.inputContainer}>
              <TextField
                sx={styles.textField}
                required={true}
                select
                id="select-status"
                label="Status"
                value={donor.status}
                onChange={handleInput("status", setDonor)}
              >
                {donorStatuses.map((status, index) => (
                  <MenuItem key={index} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={styles.inputContainer}>
              <TextField
                sx={styles.textField}
                required={false}
                id="phoneNumber"
                label="Phone Number"
                value={person.phoneNumber}
                onChange={handleInput("phoneNumber", setPerson)}
              />
            </Box>
            {donor.type === "Individual" && (
              <>
                <Box sx={styles.inputContainer}>
                  <TextField
                    sx={styles.textField}
                    required={true}
                    id="firstName"
                    label="First Name"
                    value={person.firstName}
                    onChange={handleInput("firstName", setPerson)}
                    error={requiredError.firstName}
                    helperText={requiredError.firstName ? "Field is required" : ""}
                  />
                </Box>
                <Box sx={styles.inputContainer}>
                  <TextField
                    sx={styles.textField}
                    required={true}
                    id="lastName"
                    label="Last Name"
                    value={person.lastName}
                    onChange={handleInput("lastName", setPerson)}
                    error={requiredError.lastName}
                    helperText={requiredError.lastName ? "Field is required" : ""}
                  />
                </Box>
              </>
            )}

            {(donor.type === "Corporate" || donor.type === "Foundation") && (
              <>
                <Box sx={styles.inputContainer}>
                  <TextField
                    sx={styles.textField}
                    required={true}
                    id="firstName"
                    label="First Name"
                    value={person.firstName}
                    onChange={handleInput("firstName", setPerson)}
                    error={requiredError.firstName}
                    helperText={requiredError.firstName ? "Field is required" : ""}
                  />
                </Box>
              </>
            )}
            <Box sx={styles.inputContainer}>
              <TextField
                sx={styles.textField}
                required={true}
                id="email"
                label="Email Address"
                value={person.emailAddress}
                onChange={handleInput("emailAddress", setPerson)}
                error={requiredError.emailAddress}
                helperText={requiredError.emailAddress ? "Field is required" : ""}
              />
            </Box>
            <Box sx={styles.inputContainer}>
              <TextField
                sx={styles.textField}
                required={true}
                id="address-line1"
                label="Address Line 1"
                value={address.addressLine1}
                onChange={handleInput("addressLine1", setAddress)}
                error={requiredError.addressLine1}
                helperText={requiredError.addressLine1 ? "Field is required" : ""}
              />
            </Box>
            <Box sx={styles.inputContainer}>
              <TextField
                sx={styles.textField}
                required={false}
                id="address-line2"
                label="Address Line 2"
                value={address.addressLine2}
                onChange={handleInput("addressLine2", setAddress)}
              />
            </Box>
            <Box sx={styles.inputContainer}>
              <TextField
                sx={styles.textField}
                required={true}
                id="address-city"
                label="City"
                value={address.city}
                onChange={handleInput("city", setAddress)}
                error={requiredError.city}
                helperText={requiredError.city ? "Field is required" : ""}
              />
            </Box>

            <Box sx={styles.inputContainer}>
              <TextField
                sx={styles.textField}
                required={true}
                select
                id="select-state"
                label="State"
                value={address.state}
                onChange={handleInput("state", setAddress)}
              >
                {statesChoices.map((state: any, index: number) => (
                  <MenuItem key={index} value={state.value}>
                    {state.value}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={styles.inputContainer}>
              <TextField
                sx={styles.textField}
                required={false}
                id="address-zipcode"
                type="number"
                label="Zip Code"
                value={address.zipCode}
                onChange={handleInput("zipCode", setAddress)}
              />
            </Box>
            <Box sx={styles.inputContainer}>
              <TextField
                id="multiline-notes"
                label="Note"
                multiline
                rows={4}
                fullWidth
                value={donor.notes}
                onChange={handleInput("notes", setDonor)}
              />
            </Box>
            <Box sx={styles.inputContainer}></Box>
          </Box>
        </>
      )}

      <Box sx={{ paddingLeft: 5, fontSize: 24 }}>Donation Info</Box>
      <Box sx={styles.container} component="form">
        <Box sx={styles.inputContainer}>
          <TextField
            sx={styles.textField}
            required={true}
            select
            id="select-type"
            label="Type"
            value={donation.type}
            onChange={handleInput("type", setDonation)}
          >
            {donationTypes.map((type, index) => (
              <MenuItem key={index} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        {donation.type === "recurring" && (
          <Box sx={styles.inputContainer}>
            <TextField
              sx={styles.textField}
              select
              id="select-recurrence"
              label="Recurrence"
              value={donation.recurringFrequency}
              onChange={handleInput("recurringFrequency", setDonation)}
            >
              {recurringFrequencies.map((freq, index) => (
                <MenuItem key={index} value={freq}>
                  {freq}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}
        <Box sx={styles.inputContainer}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              sx={styles.textField}
              label="Date"
              value={new Date(donation.date)}
              onChange={(newDate: any) => {
                setDonation((prev: DonationState) => ({
                  ...prev,
                  date: newDate.toISOString(),
                }));
              }}
            />
          </LocalizationProvider>
        </Box>
        <Box sx={styles.inputContainer}>
          <TextField
            sx={{
              ...styles.textField,
              "& input[type=number]": {
                MozAppearance: "textfield",
              },
              "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
            }}
            required={true}
            id="amount"
            label={donation.type !== "In-Kind" ? "Donation Amount" : "Item(s) Worth"}
            type="number"
            value={donation.amount}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (donation.amount === 0 && !event.target.value.includes(".")) {
                event.target.value = event.target.value.replace(/^0+/, "");
              }
              setDonation((prev: DonationState) => ({
                ...prev,
                amount: Number(event.target.value),
              }));
            }}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              },
              inputLabel: {
                shrink: true,
              },
            }}
            error={requiredError.amount}
            helperText={requiredError.amount ? "Field is required" : ""}
          />
        </Box>
        <Box sx={styles.inputContainer}>
          {donation.type !== "In-Kind" ? (
            <TextField
              sx={styles.textField}
              required={true}
              select
              id="select-method"
              label="Method"
              value={donation.paymentMethod}
              onChange={handleInput("paymentMethod", setDonation)}
            >
              {paymentMethods.map((method, index) => (
                <MenuItem key={index} value={method}>
                  {method}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              sx={styles.textField}
              required={true}
              id="item"
              label="Item(s)"
              value={donation.item}
              onChange={handleInput("item", setDonation)}
              error={requiredError.item}
              helperText={requiredError.item ? "Field is required" : ""}
            />
          )}
        </Box>
        <Box sx={styles.inputContainer}>
          <TextField
            sx={styles.textField}
            required={true}
            id="campaign"
            label="Campaign"
            value={donation.campaign}
            onChange={handleInput("campaign", setDonation)}
            error={requiredError.campaign}
            helperText={requiredError.campaign ? "Field is required" : ""}
          />
        </Box>
        <Box sx={styles.inputContainer}>
          <TextField
            sx={styles.textField}
            required={true}
            id="fund"
            label="Fund"
            value={donation.fundDesignation}
            onChange={handleInput("fundDesignation", setDonation)}
            error={requiredError.fundDesignation}
            helperText={requiredError.fundDesignation ? "Field is required" : ""}
          />
        </Box>
        <Box sx={styles.inputContainer}>
          <TextField
            sx={styles.textField}
            required={true}
            select
            id="select-source"
            label="Donation Source"
            value={donation.source}
            onChange={handleInput("source", setDonation)}
          >
            {donationSources.map((source, index) => (
              <MenuItem key={index} value={source}>
                {source}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={styles.inputContainer}>
          <TextField
            sx={styles.textField}
            required={true}
            select
            id="select-matching"
            label="Matching Donation?"
            value={donation.isMatching}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDonation((prev: DonationState) => ({
                ...prev,
                isMatching: event.target.value === "true",
              }));
            }}
          >
            <MenuItem value={"true"}>Yes</MenuItem>
            <MenuItem value={"false"}>No</MenuItem>
          </TextField>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 5 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Add Donation
        </Button>
      </Box>
    </Box>
  );
}

const styles = {
  container: {
    p: 4,
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 2,
    width: "100%",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    my: 2,
  },
  textField: {
    width: "100%",
  },
};
