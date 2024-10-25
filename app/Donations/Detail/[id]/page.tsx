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
import {
  donors,
  donations,
  persons,
  Donation,
} from "@/app/utils/donationTestData";
import { useState } from "react";

type DonationState = {
  type: string;
  amount: number;
  item: string | null;
  paymentMethod: string | null;
  campaign: string;
  fundDesignation: string;
  date: Date;
  recurrenceFrequency: string;
  source: string;
  isMatching: boolean;
  receiptSent: boolean;
  receiptNumber: string;
  isAnonymous: boolean;
  acknowledgementSent: boolean;
};

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
  "No",
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

export default function DonationDetail() {
  const { id }: { id: string } = useParams();
  const parsedId = parseInt(id, 10);

  if (donations[parsedId] == null) {
    return <Typography>Donation not found</Typography>;
  }

  const [donation, setDonation] = useState<DonationState>({
    type: donations[parsedId].type,
    amount: donations[parsedId].amount,
    item: donations[parsedId].item,
    paymentMethod: donations[parsedId].paymentMethod,
    campaign: donations[parsedId].campaign,
    fundDesignation: donations[parsedId].fundDesignation,
    date: donations[parsedId].date,
    recurrenceFrequency: donations[parsedId].recurrenceFrequency,
    source: donations[parsedId].source,
    isMatching: donations[parsedId].isMatching,
    receiptSent: donations[parsedId].receiptSent,
    receiptNumber: donations[parsedId].receiptNumber,
    isAnonymous: donations[parsedId].isAnonymous,
    acknowledgementSent: donations[parsedId].acknowledgementSent,
  });

  const Body = () => {
    return (
      <Box>
        <Box sx={styles.inputContainer}>
          <TextField
            sx={styles.textField}
            required
            select
            id="select-type"
            label="Type"
            value={donation.type}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDonation((prev) => ({ ...prev, type: event.target.value }));
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
            label={
              donation.type !== "In-Kind" ? "Donation Amount" : "Item(s) Worth"
            }
            type="number"
            value={donation.amount}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (donation.amount === 0 && !event.target.value.includes(".")) {
                event.target.value = event.target.value.replace(/^0+/, "");
              }
              setDonation((prev) => ({
                ...prev,
                amount: Number(event.target.value),
              }));
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
          {donation.type !== "In-Kind" ? (
            <TextField
              sx={styles.textField}
              required
              select
              id="select-method"
              label="Method"
              value={donation.paymentMethod}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDonation((prev) => ({
                  ...prev,
                  paymentMethod: event.target.value,
                }));
              }}
            >
              {paymentMethods.map((method) => (
                <MenuItem value={method}>{method}</MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              sx={styles.textField}
              required={true}
              id="item"
              label="Item(s)"
              value={donation.item}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDonation((prev) => ({
                  ...prev,
                  item: event.target.value,
                }));
              }}
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDonation((prev) => ({
                ...prev,
                campaign: event.target.value,
              }));
            }}
          />
          <TextField
            sx={styles.textField}
            required
            id="fund"
            label="Fund"
            value={donation.fundDesignation}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDonation((prev) => ({
                ...prev,
                fundDesignation: event.target.value,
              }));
            }}
          />
          <TextField
            sx={styles.textField}
            required
            id="date"
            label="Donation Date"
            type="date"
            value={donation.date || new Date().toISOString().split("T")[0]}
            onChange={(event: any) =>
              setDonation((prev) => ({ ...prev, date: event.target.value }))
            }
          />
        </Box>

        <Box sx={styles.inputContainer}>
          <TextField
            sx={styles.textField}
            select
            id="select-recurrence"
            label="Recurrence"
            value={donation.recurrenceFrequency}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDonation((prev) => ({
                ...prev,
                recurrenceFrequency: event.target.value,
              }));
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
            value={donation.source}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDonation((prev) => ({ ...prev, source: event.target.value }));
            }}
          >
            {donationSources.map((source) => (
              <MenuItem value={source}>{source}</MenuItem>
            ))}
          </TextField>
          <TextField
            sx={styles.textField}
            required
            select
            id="select-matching"
            label="Matching Donation?"
            helperText="Is this donation matched by an employer or partner organization?"
            value={donation.isMatching}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDonation((prev) => ({
                ...prev,
                isMatching: event.target.value === "true",
              }));
            }}
          >
            <MenuItem value={"true"}>Yes</MenuItem>
            <MenuItem value={"false"}>No</MenuItem>
          </TextField>
        </Box>

        <Box sx={styles.inputContainer}>
          <TextField
            sx={styles.textField}
            required
            select
            id="select-receiptSent"
            label="Receipt Sent?"
            value={donation.receiptSent}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDonation((prev) => ({
                ...prev,
                receiptSent: event.target.value === "true",
              }));
            }}
          >
            <MenuItem value={"true"}>Yes</MenuItem>
            <MenuItem value={"false"}>No</MenuItem>
          </TextField>
          <TextField
            sx={styles.textField}
            required={true}
            disabled={donation.receiptSent === false}
            id="receiptNumber"
            label="Receipt Number"
            value={donation.receiptNumber}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDonation((prev) => ({
                ...prev,
                receiptNumber: event.target.value,
              }));
            }}
          />
          <TextField
            sx={styles.textField}
            required
            select
            id="select-anonymous"
            label="Anonymous?"
            value={donation.isAnonymous}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDonation((prev) => ({
                ...prev,
                isAnonymous: event.target.value === "true",
              }));
            }}
          >
            <MenuItem value={"true"}>Yes</MenuItem>
            <MenuItem value={"false"}>No</MenuItem>
          </TextField>
        </Box>

        <Box sx={styles.inputContainer}>
          <TextField
            sx={styles.textField}
            required
            select
            id="select-acknowledgement"
            label="Acknowledgement Sent?"
            value={donation.acknowledgementSent}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDonation((prev) => ({
                ...prev,
                acknowledgementSent: event.target.value === "true",
              }));
            }}
          >
            <MenuItem value={"true"}>Yes</MenuItem>
            <MenuItem value={"false"}>No</MenuItem>
          </TextField>
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
      </Box>
    );
  };

  const Footer = () => {
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

  return (
    <Box sx={styles.container} component="form">
      <Typography variant="h6">
        Donation Details for:{" "}
        {
          persons[
            parseInt(
              donors[parseInt(donations[parsedId].donorId, 10)].personId,
              10
            )
          ].firstName
        }{" "}
        {
          persons[
            parseInt(
              donors[parseInt(donations[parsedId].donorId, 10)].personId,
              10
            )
          ].lastName
        }
      </Typography>
      <Body />
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
    backgroundColor: "#1a345b",
  },
  buttonOutlined: {
    borderColor: "black",
    color: "black",
  },
};
