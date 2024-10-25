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
import { donors, persons } from "@/app/utils/donationTestData";
import { useState } from "react";

type DonorState = {
  type: string;
};

const donorTypes: string[] = [
  "Individual",
  "Corporate",
  "Foundation",
  "Other...",
];

export default function DonorDetail() {
  const { id }: { id: string } = useParams();
  const parsedId = parseInt(id, 10);

  if (donors[parsedId] == null) {
    return <Typography>Donor not found</Typography>;
  }

  const [donor, setDonor] = useState<DonorState>({
    type: donors[parsedId].type,
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
            value={donor.type}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDonor((prev) => ({ ...prev, type: event.target.value }));
            }}
          >
            {donorTypes.map((type) => (
              <MenuItem value={type}>{type}</MenuItem>
            ))}
          </TextField>
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
        Donor Details for:{" "}
        {persons[parseInt(donors[parsedId].personId, 10)].firstName}{" "}
        {persons[parseInt(donors[parsedId].personId, 10)].lastName}
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
