"use client";
import { useParams } from "next/navigation";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  DonationState,
  DonationResponse,
  RequiredDonationState,
} from "@/app/types/states";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { Footer } from "@/app/components/donationHandleFooter";

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
  "None",
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
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [donation, setDonation] = useState<DonationState>({
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
  });
  const donorNameRef = useRef<string>("");

  const [requiredError, setRequiredError] = useState({
    amount: false,
    item: false,
    campaign: false,
    fundDesignation: false,
    receiptNumber: false,
  });

  const fetchDonation = async () => {
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/donations/${id}`,
        {
          method: "GET",
        }
      );

      const { data } = (await result.json()) as DonationResponse;

      if (!result.ok) {
        router.push("/not-found");
        throw new Error("Error fetching donation");
      }

      donorNameRef.current = `${data.donor.person.firstName} ${data.donor.person.lastName}`;

      setDonation({
        type: data.type,
        amount: data.amount,
        item: data.item,
        paymentMethod: data.paymentMethod,
        campaign: data.campaign,
        fundDesignation: data.fundDesignation,
        date: data.date,
        recurringFrequency: data.recurringFrequency,
        source: data.source,
        isMatching: data.isMatching,
        receiptSent: data.receiptSent,
        receiptNumber: data.receiptNumber,
        isAnonymous: data.isAnonymous,
        acknowledgementSent: data.acknowledgementSent,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonation();
  }, []);

  const handleInput =
    <T,>(label: keyof T, setState: React.Dispatch<React.SetStateAction<T>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.trim() === "") {
        setRequiredError((prev: RequiredDonationState) => ({
          ...prev,
          [label]: true,
        }));
      } else {
        setRequiredError((prev: RequiredDonationState) => ({
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
            Donation General Information for: {donorNameRef.current}
          </Typography>
          <Box>
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
                id="amount"
                label={
                  donation.type !== "In-Kind"
                    ? "Donation Amount"
                    : "Item(s) Worth"
                }
                type="number"
                value={donation.amount}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (
                    donation.amount === 0 &&
                    !event.target.value.includes(".")
                  ) {
                    event.target.value = event.target.value.replace(/^0+/, "");
                  }
                  setDonation((prev: DonationState) => ({
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
                error={requiredError.amount}
                helperText={requiredError.amount ? "Field is required" : ""}
              />
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
              <TextField
                sx={styles.textField}
                required={true}
                id="fund"
                label="Fund"
                value={donation.fundDesignation}
                onChange={handleInput("fundDesignation", setDonation)}
                error={requiredError.fundDesignation}
                helperText={
                  requiredError.fundDesignation ? "Field is required" : ""
                }
              />
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

            <Typography variant="h6">Tax Information</Typography>
            <Typography variant="h6">tax deductible amount??</Typography>
            <Box sx={styles.inputContainer}>
              <TextField
                sx={styles.textField}
                required={true}
                select
                id="select-receiptSent"
                label="Receipt Sent?"
                value={donation.receiptSent}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setDonation((prev: DonationState) => ({
                    ...prev,
                    receiptSent: event.target.value === "true",
                  }));
                }}
              >
                <MenuItem value={"true"}>Yes</MenuItem>
                <MenuItem value={"false"}>No</MenuItem>
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
                disabled={donation.receiptSent === false}
                id="receiptNumber"
                label="Receipt Number"
                type={"number"}
                value={donation.receiptNumber}
                onChange={handleInput("receiptNumber", setDonation)}
                error={requiredError.receiptNumber}
                helperText={
                  requiredError.receiptNumber ? "Field is required" : ""
                }
              />
              <TextField
                sx={styles.textField}
                required={true}
                select
                id="select-anonymous"
                label="Anonymous?"
                value={donation.isAnonymous}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setDonation((prev: DonationState) => ({
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
                required={true}
                select
                id="select-acknowledgement"
                label="Acknowledgement Sent?"
                value={donation.acknowledgementSent}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setDonation((prev: DonationState) => ({
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
          <Footer
            id={id}
            name={"donation"}
            href={"/Donations"}
            apiUrl={"/v1/donations"}
            requiredError={requiredError}
            donation={donation}
          />
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
