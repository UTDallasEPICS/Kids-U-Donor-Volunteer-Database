"use client";
import { useParams, useRouter } from "next/navigation";
import { Box, TextField, Typography, MenuItem } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Loading from "@/app/loading";
import { states } from "@/app/utils/US";
import { Footer } from "../../../components/donationHandleFooter";
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

const donorSegments: string[] = [
  "High Value Donor",
  "Lapsed",
  "First Time Donor",
];

const donorCommPrefs: string[] = ["Email", "Mail", "Phone"];

export default function DonorDetail() {
  const { id }: { id: string } = useParams();
  const router = useRouter();

  /* TO DO TO DO TO DO TO DO TO DO TO DO TO DO TO DO TO DO TO DO TO DO TO DO TO DO
  check if data has been updated, if not then don't send api request https://www.reddit.com/r/reactjs/comments/x4acgb/how_do_i_secure_my_nextjs_api_from_users_that/
  Not found page, better looking 404
  Make separate tables for custom adding fields
  receipt number in donations?
  */

  const [isLoading, setIsLoading] = useState<boolean>(true);
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
  const personNameRef = useRef<string>("");

  const [requiredError, setRequiredError] = useState({
    firstName: false,
    lastName: false,
    emailAddress: false,
    addressLine1: false,
    city: false,
    zipCode: false,
    type: false,
  });

  const fetchDonor = async () => {
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/donors/${id}`,
        {
          method: "GET",
        }
      );

      const { data } = (await result.json()) as donorResponse;

      if (!result.ok) {
        router.push("/not-found");
        throw new Error("Error fetching donor");
      }

      personNameRef.current = `${data.person.firstName} ${data.person.lastName}`;

      setDonor({
        type: data.type,
        communicationPreference: data.communicationPreference,
        status: data.status,
        notes: data.notes,
        isRetained: data.isRetained,
        segment: data.segment,
      });

      setPerson({
        firstName: data.person.firstName,
        lastName: data.person.lastName,
        phoneNumber: data.person.phoneNumber,
        emailAddress: data.person.emailAddress,
      });

      setAddress({
        addressLine1: data.person.address.addressLine1,
        addressLine2: data.person.address.addressLine2,
        city: data.person.address.city,
        state: data.person.address.state,
        zipCode: data.person.address.zipCode,
        type: data.person.address.type,
      });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDonor();
  }, []);

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

  return (
    <Box>
      {isLoading ? (
        <Loading />
      ) : (
        <Box sx={styles.container} component="form">
          <Typography variant="h6">
            Donor Details for: {personNameRef.current}
          </Typography>
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
              required={true}
              select
              id="select-retention"
              label="Retention"
              //helperText="Is this donor retained from last year"
              value={donor.isRetained}
              onChange={handleInput("isRetained", setDonor)}
            >
              <MenuItem value={"true"}>Yes</MenuItem>
              <MenuItem value={"false"}>No</MenuItem>
            </TextField>
            <TextField
              sx={styles.textField}
              required={true}
              select
              id="select-segmentation"
              label="Segmentation"
              value={donor.segment}
              onChange={handleInput("segment", setDonor)}
            >
              <MenuItem value={"None"}>None</MenuItem>
              {donorSegments.map((segment, index) => (
                <MenuItem key={index} value={segment}>
                  {segment}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              sx={{ ...styles.textField, visibility: "hidden" }}
              id="style"
              label="styling"
            />
          </Box>

          <Typography variant="h6">Donor Notes</Typography>
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
          {donor.type === "Individual" ? (
            <Box>
              <Typography variant="h6">Individual Details</Typography>
              <Box sx={styles.inputContainer}>
                <TextField
                  sx={styles.textField}
                  required={true}
                  id="firstName"
                  label="First Name"
                  value={person.firstName}
                  onChange={handleInput("firstName", setPerson)}
                  error={requiredError.firstName}
                  helperText={
                    requiredError.firstName ? "Field is required" : ""
                  }
                />
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
                <TextField
                  sx={styles.textField}
                  required={true}
                  id="email"
                  label="Email Address"
                  value={person.emailAddress}
                  onChange={handleInput("emailAddress", setPerson)}
                  error={requiredError.emailAddress}
                  helperText={
                    requiredError.emailAddress ? "Field is required" : ""
                  }
                />
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
                <TextField
                  sx={{ ...styles.textField, visibility: "hidden" }}
                  id="style"
                  label="styling"
                />
                <TextField
                  sx={{ ...styles.textField, visibility: "hidden" }}
                  id="style"
                  label="styling"
                />
              </Box>

              <Box sx={styles.inputContainer}>
                <TextField
                  sx={styles.textField}
                  required={true}
                  id="address"
                  label="Address Line 1"
                  value={address.addressLine1}
                  onChange={handleInput("addressLine1", setAddress)}
                  error={requiredError.addressLine1}
                  helperText={
                    requiredError.addressLine1 ? "Field is required" : ""
                  }
                />
                <TextField
                  sx={styles.textField}
                  required={false}
                  id="address"
                  label="Address Line 2"
                  value={address.addressLine2}
                  onChange={handleInput("addressLine2", setAddress)}
                />
                <TextField
                  sx={styles.textField}
                  required={true}
                  id="address"
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
                <TextField
                  sx={{
                    ...styles.textField,
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                    "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                      {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                  }}
                  required={true}
                  type="number"
                  id="address"
                  label="Zip Code"
                  value={address.zipCode}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPerson((prev: PersonState) => ({
                      ...prev,
                      zipCode: Number(event.target.value),
                    }));
                  }}
                  error={requiredError.zipCode}
                  helperText={requiredError.zipCode ? "Field is required" : ""}
                />
                <TextField
                  sx={styles.textField}
                  required={true}
                  id="type"
                  label="Address Type"
                  value={address.type}
                  onChange={handleInput("type", setAddress)}
                  error={requiredError.type}
                  helperText={requiredError.type ? "Field is required" : ""}
                />
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6">Organization Details</Typography>
            </Box>
          )}
          <Footer
            id={id}
            name={"donor"}
            href={"/Donors"}
            apiUrl={"/v1/donors"}
            requiredError={requiredError}
            donor={donor}
            person={person}
            address={address}
          />
          <Typography variant="h6">
            Donor Lifetime Value (placeholder calculation)
          </Typography>
          <Typography variant="h6">
            Donation History (Click for more)
          </Typography>
        </Box>
      )}
    </Box>
  );
}

const styles = {
  container: {
    p: 4,
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    my: 2,
  },
  textField: {
    flex: 1,
  },
};
