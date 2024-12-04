"use client";
import { Box, TextField, Button, MenuItem, Select } from "@mui/material";
import * as React from "react";
import { states } from "@/app/utils/US";
import { useEffect, useRef, useState } from "react";
import {
  DonorState,
  PersonState,
  AddressState,
  RequiredDonorPersonState,
  donorResponse,
} from "@/app/types/states";

const donorTypes: string[] = ["Individual", "Corporate", "Foundation"];

const donorStatuses: string[] = [
  "Active",
  "Lapsed",
  "Major Donor",
  "First Time Donor",
];

const donorCommPrefs: string[] = ["Email", "Mail", "Phone"];

export default function AddDonor() {
  const [donor, setDonor] = useState<DonorState>({
    type: "",
    communicationPreference: "",
    status: "",
    notes: "",
    isRetained: false,
    segment: null,
  });
  const [person, setPerson] = useState<PersonState>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: "",
  });
  const [address, setAddress] = useState<AddressState>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    type: "",
  });
  //const { donorType, donorStatus, contactMethod } = donor;

  const [requiredError, setRequiredError] = useState({
    firstName: false,
    lastName: false,
    emailAddress: false,
    addressLine1: false,
    city: false,
    zipCode: false,
    type: false,
  });

  const handleInput =
    <T,>(label: keyof T, setState: React.Dispatch<React.SetStateAction<T>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.trim() === "") {
        setRequiredError((prev: RequiredDonorPersonState) => ({
          ...prev,
          [label]: true,
        }));
      } else {
        setRequiredError((prev: RequiredDonorPersonState) => ({
          ...prev,
          [label]: false,
        }));
      }

      setState((prev: T) => ({
        ...prev,
        [label]: event.target.value.trim(),
      }));
    };

  const handleSubmit = async () => {
    if (Object.values(requiredError).some((error) => error)) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await fetch("/api/v1/donors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ donor, person, address }),
      });

      if (!response.ok) {
        throw new Error("Failed to add donor");
      }

      const result = await response.json();

      setDonor({
        type: "",
        communicationPreference: "",
        status: "",
        notes: "",
        isRetained: false,
        segment: null,
      });
      setPerson({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        emailAddress: "",
      });
      setAddress({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        type: "",
      });
      setRequiredError({
        firstName: false,
        lastName: false,
        emailAddress: false,
        addressLine1: false,
        city: false,
        zipCode: false,
        type: false,
      });

      console.log("Donor added:", result);
    } catch (error) {
      console.error("Error adding donor:", error);
      alert("An error occurred while adding the donor.");
    }
  };

  return (
    <Box>
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
            {states.map((state, index) => (
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
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 5 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Add Donor
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
