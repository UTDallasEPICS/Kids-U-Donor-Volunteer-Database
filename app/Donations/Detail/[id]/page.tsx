"use client";
import { useParams } from "next/navigation";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  MenuItem,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { donors } from "@/app/utils/donationTestData";
import { useState } from "react";

// Add possible feature to add more types/methods, eventually
const donationTypes: string[] = ["One-Time", "Recurring", "Pledge", "In-Kind"];
const paymentMethods: string[] = [
  "Credit Card",
  "Check",
  "Bank Transfer",
  "Cash",
  "ACH",
  "PayPal",
  "Venmo",
  "Zelle",
];
const recurringFrequencies: string[] = [
  "N/A",
  "Monthly",
  "Quarterly",
  "Annually",
];
const donationSources: string[] = [
  "Website",
  "Social Media",
  "Event",
  "Email",
  "Direct Mail",
  "Referral",
];
const matchingDonations: string[] = ["Yes", "No"];

export const Footer = () => {
  return (
    <Box sx={styles.footerContainer}>
      <Button
        sx={styles.buttonContained}
        variant="contained"
        onClick={() => {
          alert("clicked");
        }}
      >
        Save
      </Button>
      <Button
        sx={styles.buttonContained}
        variant="contained"
        onClick={() => {
          alert("clicked");
        }}
      >
        Delete
      </Button>
      <Button
        sx={styles.buttonOutlined}
        variant="outlined"
        onClick={() => {
          alert("clicked");
        }}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default function DonationDetail() {
  const { id }: { id: string } = useParams();
  const parsedId = parseInt(id, 10);

  const [donorName, setDonorName] = useState<string>(
    donors[parsedId].donorName
  );
  const [type, setType] = useState<string>(donors[parsedId].type);
  const [amount, setAmount] = useState<number>(donors[parsedId].amount);
  const [method, setMethod] = useState<string>(donors[parsedId].method);
  const [campaign, setCampaign] = useState<string>(donors[parsedId].campaign);
  const [fund, setFund] = useState<string>(donors[parsedId].fund);
  const [date, setDate] = useState<Date>(donors[parsedId].date);
  const [recurrence, setRecurrence] = useState<string>(
    donors[parsedId].recurrence
  );
  const [source, setSource] = useState<string>(donors[parsedId].source);
  const [matching, setMatching] = useState<string>(donors[parsedId].matching);

  return (
    <Box sx={styles.container} component="form">
      <Typography variant="h5">Donation Detail</Typography>
      <Box sx={styles.inputContainer}>
        <TextField
          sx={styles.textField}
          required
          id="name"
          label="Donor"
          value={donorName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setDonorName(event.target.value);
          }}
        />
        <TextField
          sx={styles.textField}
          required
          select
          id="select-type"
          label="Type"
          value={type}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setType(event.target.value);
          }}
        >
          {donationTypes.map((type) => (
            <MenuItem value={type}>{type}</MenuItem>
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
          required
          id="amount"
          label="Donation Amount"
          type="number"
          value={amount}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (amount === 0 && !event.target.value.includes(".")) {
              event.target.value = event.target.value.replace(/^0+/, "");
            }
            setAmount(Number(event.target.value));
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            },
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </Box>
      <Box sx={styles.inputContainer}>
        <TextField
          sx={styles.textField}
          required
          select
          id="select-method"
          label="Method"
          value={method}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setMethod(event.target.value);
          }}
        >
          {paymentMethods.map((method) => (
            <MenuItem value={method}>{method}</MenuItem>
          ))}
        </TextField>
        <TextField
          sx={styles.textField}
          required={true}
          id="campaign"
          label="Campaign"
          value={campaign}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCampaign(event.target.value);
          }}
        />
        <TextField
          sx={styles.textField}
          required
          id="fund"
          label="Fund"
          value={fund}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFund(event.target.value);
          }}
        />
      </Box>
      <Box sx={styles.inputContainer}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            sx={styles.textField}
            label="Date"
            value={date || new Date()}
            onChange={(newDate) => {
              if (newDate) {
                setDate(newDate);
              }
            }}
          />
        </LocalizationProvider>
        <TextField
          sx={styles.textField}
          select
          id="select-recurrence"
          label="Recurrence"
          value={recurrence}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setRecurrence(event.target.value);
          }}
        >
          {recurringFrequencies.map((freq) => (
            <MenuItem value={freq}>{freq}</MenuItem>
          ))}
        </TextField>
        <TextField
          sx={styles.textField}
          required
          select
          id="select-source"
          label="Donation Source"
          value={source}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSource(event.target.value);
          }}
        >
          {donationSources.map((source) => (
            <MenuItem value={source}>{source}</MenuItem>
          ))}
        </TextField>
      </Box>
      <Box sx={styles.inputContainer}>
        {
          <TextField
            sx={styles.textField}
            required
            select
            id="select-matching"
            label="Matching Donation?"
            helperText="Is this donation matched by an employer or partner organization?"
            value={matching}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setMatching(event.target.value);
            }}
          >
            {matchingDonations.map((matchingDonation) => (
              <MenuItem value={matchingDonation}>{matchingDonation}</MenuItem>
            ))}
          </TextField>
        }
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
      <Footer />
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
  footerContainer: {
    display: "flex",
    gap: 1,
    py: 2,
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
  buttonContained: {
    backgroundColor: "#455a64",
  },
  buttonOutlined: {
    borderColor: "black",
    color: "black",
  },
};
