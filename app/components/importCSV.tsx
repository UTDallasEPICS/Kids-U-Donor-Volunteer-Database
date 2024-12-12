"use client";
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const Import = () => {
  const [file, setFile] = useState<File | null>(null);

  /*
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { isDirty, isValid, errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      status: "",
      amountRequested: "",
      amountAwarded: "",
      purpose: "",
      startDate: "",
      endDate: "",
      isMultipleYears: "",
      quarter: "",
      acknowledgementSent: "",
      awardNotificationDate: "",
      fundingArea: "",
      internalProposalDueDate: "",
      proposalDueDate: "",
      proposalSummary: "",
      proposalSubmissionDate: "",
      applicationType: "",
      internalOwner: "",
      fundingRestriction: "",
      matchingRequirement: "",
      useArea: "",
      isEligibleForRenewal: "",
      renewalApplicationDate: "",
      renewalAwardStatus: "",
      //representativeGrant: "",
      //grantAttachment: "",
    },
  });
*/
  const handleSubmitFile = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("csv", file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/csv`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || "Something went wrong";
        throw new Error(message);
      }
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.uploadContainer} component="form">
        <TextField
          type="file"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0] || null)}
          variant="outlined"
          slotProps={{
            htmlInput: { accept: ".csv" },
          }}
        />
        <Button type="submit" onSubmit={handleSubmitFile}>
          Upload
        </Button>
      </Box>

      <Box>
        <p>
          There are specific fields to import to grants. <br />
          These are the grant fields for the database schema so far, depending on Kids-U current excel sheet data, you
          will need to get their specific column names, and add a default value for anything that their excel sheet does
          not cover.
          <br />
          <br />
        </p>
        <p>name</p>
        <p>status</p>
        <p>amountRequested</p>
        <p>amountAwarded</p>
        <p>purpose</p>
        <p>startDate</p>
        <p>endDate</p>
        <p>isMultipleYears</p>
        <p>quarter</p>
        <p>acknowledgementSent</p>
        <p>awardNotificationDate</p>
        <p>fundingArea</p>
        <p>internalProposalDueDate</p>
        <p>proposalDueDate</p>
        <p>proposalSummary</p>
        <p>proposalSubmissionDate</p>
        <p>applicationType</p>
        <p>internalOwner</p>
        <p>fundingRestriction</p>
        <p>matchingRequirement</p>
        <p>useArea</p>
        <p>isEligibleForRenewal</p>
        <p>renewalApplicationDate</p>
        <p>renewalAwardStatus</p>
        <p>representativeGrant</p>
        <p>grantAttachment</p>
      </Box>
    </Box>
  );
};

const styles = {
  container: {
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  uploadContainer: {
    p: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
