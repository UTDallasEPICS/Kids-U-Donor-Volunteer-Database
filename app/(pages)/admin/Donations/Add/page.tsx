"use client";
import * as React from "react";
import {
  AddDonationDonorFormProps,
  addressTypes,
  donationSources,
  donationTypes,
  donorCommPreferences,
  donorModes,
  donorStatuses,
  donorTypes,
  paymentMethods,
  recurringFrequencies,
  statesChoices,
} from "@/app/components/formComponents/FormInputProps";
import { Box, TextField, MenuItem, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormInputDropdown } from "@/app/components/formComponents/FormInputDropdown";
import { FormInputTextfield } from "@/app/components/formComponents/FormInputTextfield";
import { FormInputDate } from "@/app/components/formComponents/FormInputDate";
import { AddFooter } from "@/app/components/donations/add/AddFooter";
import { FormInputCheckbox } from "@/app/components/formComponents/FormInputCheckbox";

export default function AddDonation() {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { isDirty, isValid, errors },
  } = useForm<AddDonationDonorFormProps>({
    mode: "onChange",
    defaultValues: {
      donation: {
        type: "",
        amount: 0,
        item: "",
        paymentMethod: "",
        campaign: "",
        fundDesignation: "",
        date: new Date(),
        recurringFrequency: "",
        source: "",
        isMatching: false,
        taxDeductibleAmount: 0,
        receiptSent: false,
        receiptNumber: "",
        isAnonymous: false,
        acknowledgementSent: false,
      },
      donor: {
        type: "Individual",
        communicationPreference: "",
        status: "",
        notes: "",
        isRetained: false,
      },
      person: { firstName: "", lastName: "", emailAddress: "", phoneNumber: "" },
      organization: { name: "", emailAddress: "" },
      address: { addressLine1: "", addressLine2: "", city: "", state: "", zipCode: "", type: "" },
    },
  });

  const [donorMode, setDonorMode] = useState("Anonymous");
  const [donorEmail, setDonorEmail] = useState("");

  // Switch modes will reset fields to regular
  useEffect(() => {
    reset({
      donation: {
        type: "",
        amount: 0,
        item: "",
        paymentMethod: "",
        campaign: "",
        fundDesignation: "",
        date: new Date(),
        recurringFrequency: "",
        source: "",
        isMatching: false,
        taxDeductibleAmount: 0,
        receiptSent: false,
        receiptNumber: "",
        isAnonymous: false,
        acknowledgementSent: false,
      },
      donor: {
        type: "Individual",
        communicationPreference: "",
        status: "",
        notes: "",
        isRetained: false,
      },
      person: { firstName: "", lastName: "", emailAddress: "", phoneNumber: "" },
      organization: { name: "", emailAddress: "" },
      address: { addressLine1: "", addressLine2: "", city: "", state: "", zipCode: "", type: "" },
    });
  }, [donorMode]);

  return (
    <Box sx={styles.container} component="form">
      <Box sx={styles.title}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Add Donation
        </Typography>
      </Box>

      <Box sx={{ gridColumn: "span 3" }}>
        <TextField
          sx={{ ...styles.textField, width: "15%" }}
          select
          label="Donor Mode"
          value={donorMode}
          onChange={(event) => setDonorMode(event.target.value)}
        >
          {donorModes.map((type, index) => (
            <MenuItem key={index} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {donorMode === "Existing" && (
        <Box sx={styles.innerContainer}>
          <Box sx={styles.title}>
            <Typography variant="h5" style={styles.titleText}>
              Donor Info
            </Typography>
          </Box>
          <TextField
            sx={{ ...styles.textField, gridColumn: "span 3" }}
            label="Donor Email"
            value={donorEmail}
            onChange={(event) => setDonorEmail(event.target.value)}
          ></TextField>
        </Box>
      )}

      {donorMode === "New" && (
        <Box sx={styles.innerContainer}>
          <Box sx={styles.title}>
            <Typography variant="h5" style={styles.titleText}>
              Donor Info
            </Typography>
          </Box>

          <FormInputDropdown
            name={"donor.type"}
            control={control}
            label={"Type"}
            required
            menuItems={donorTypes}
            sx={styles.textField}
          />
          <FormInputDropdown
            name={"donor.communicationPreference"}
            control={control}
            label={"Communication Preference"}
            required
            menuItems={donorCommPreferences}
            sx={styles.textField}
          />
          <FormInputDropdown
            name={"donor.status"}
            control={control}
            label={"Status"}
            required
            menuItems={donorStatuses}
            sx={styles.textField}
          />
          <FormInputCheckbox
            control={control}
            setValue={setValue}
            name={"donor.isRetained"}
            label={"Retention"}
            required
          />
          <Box sx={{ gridColumn: "span 3" }}>
            <FormInputTextfield
              name={"donor.notes"}
              control={control}
              label={"Notes"}
              multiline
              rows={5}
              fullWidth
              sx={styles.textField}
            />
          </Box>

          <Controller
            name="donor.type"
            control={control}
            render={({ field: { value } }) => (
              <Box sx={styles.innerContainer}>
                <Box sx={styles.title}>
                  <Typography variant="h6" sx={styles.titleText}>
                    {value !== "Individual" ? "Organization" : "Individual"} Details
                  </Typography>
                </Box>

                {value !== "Individual" ? (
                  <>
                    <FormInputTextfield
                      name={"organization.name"}
                      control={control}
                      label={"Name"}
                      required
                      sx={styles.textField}
                    />
                    <FormInputTextfield
                      name={"organization.emailAddress"}
                      control={control}
                      label={"Email Address"}
                      required
                      sx={styles.textField}
                    />
                    <TextField sx={{ ...styles.textField, visibility: "hidden" }} label="styling" />
                  </>
                ) : (
                  <>
                    <FormInputTextfield
                      name={"person.firstName"}
                      control={control}
                      label={"First Name"}
                      required
                      sx={styles.textField}
                    />
                    <FormInputTextfield
                      name={"person.lastName"}
                      control={control}
                      label={"Last Name"}
                      required
                      sx={styles.textField}
                    />
                    <FormInputTextfield
                      name={"person.emailAddress"}
                      control={control}
                      label={"Email Address"}
                      required
                      sx={styles.textField}
                    />
                    <FormInputTextfield
                      name={"person.phoneNumber"}
                      control={control}
                      label={"Phone Number"}
                      maxLength={12}
                      sx={styles.textField}
                    />
                    <TextField sx={{ ...styles.textField, visibility: "hidden" }} label="styling" />
                    <TextField sx={{ ...styles.textField, visibility: "hidden" }} label="styling" />
                  </>
                )}
                <FormInputTextfield
                  name={"address.addressLine1"}
                  control={control}
                  label={"Address Line 1"}
                  required
                  sx={styles.textField}
                />
                <FormInputTextfield
                  name={"address.addressLine2"}
                  control={control}
                  label={"Address Line 2"}
                  sx={styles.textField}
                />
                <FormInputTextfield
                  name={"address.city"}
                  control={control}
                  label={"City"}
                  required
                  sx={styles.textField}
                />
                <FormInputDropdown
                  name={"address.state"}
                  control={control}
                  label={"State"}
                  required
                  menuItems={statesChoices}
                  sx={styles.textField}
                />
                <FormInputTextfield
                  name={"address.zipCode"}
                  control={control}
                  label={"Zip Code"}
                  required
                  sx={styles.textField}
                  type="zip"
                />
                <FormInputDropdown
                  name={"address.type"}
                  control={control}
                  label={"Type"}
                  required
                  menuItems={addressTypes}
                  sx={styles.textField}
                />
              </Box>
            )}
          />
        </Box>
      )}

      <Box sx={styles.innerContainer}>
        <Box sx={styles.title}>
          <Typography variant="h5" style={styles.titleText}>
            Donation Info
          </Typography>
        </Box>
        <FormInputDropdown
          name={"donation.type"}
          control={control}
          label={"Type"}
          required={true}
          menuItems={donationTypes}
          sx={styles.textField}
        />
        <Controller
          name="donation.type"
          control={control}
          render={({ field: { value } }) => {
            const label = value !== "In-Kind" ? "Donation Amount" : "Item(s) Value";
            return (
              <FormInputTextfield
                name={"donation.amount"}
                control={control}
                label={label}
                required={true}
                type={"currency"}
                sx={styles.textField}
              />
            );
          }}
        />
        <Controller
          name="donation.type"
          control={control}
          render={({ field: { value } }) =>
            value !== "In-Kind" ? (
              <FormInputDropdown
                name={"donation.paymentMethod"}
                control={control}
                label={"Method"}
                required
                menuItems={paymentMethods}
                sx={styles.textField}
              />
            ) : (
              <FormInputTextfield
                name={"donation.item"}
                control={control}
                label={"Item(s)"}
                required
                sx={styles.textField}
              />
            )
          }
        />
        <FormInputTextfield
          name={"donation.campaign"}
          control={control}
          label={"Campaign"}
          required={true}
          sx={styles.textField}
        />
        <FormInputTextfield
          name={"donation.fundDesignation"}
          control={control}
          label={"Fund"}
          required={true}
          sx={styles.textField}
        />
        <FormInputDate name={"donation.date"} control={control} label={"Date"} required={true} sx={styles.textField} />
        <FormInputDropdown
          name={"donation.recurringFrequency"}
          control={control}
          label={"Recurrence"}
          required={true}
          menuItems={recurringFrequencies}
          sx={styles.textField}
        />
        <FormInputDropdown
          name={"donation.source"}
          control={control}
          label={"Donation Source"}
          required={true}
          menuItems={donationSources}
          sx={styles.textField}
        />
        <FormInputCheckbox
          control={control}
          setValue={setValue}
          name={"donation.isMatching"}
          label={"Matching Donation?"}
          required
        />
        <FormInputTextfield
          name={"donation.taxDeductibleAmount"}
          control={control}
          label={"Tax Deductible Amount"}
          type={"currency"}
          required={true}
          sx={styles.textField}
        />
        <FormInputCheckbox
          control={control}
          setValue={setValue}
          name={"donation.acknowledgementSent"}
          label={"Acknowledgement Sent?"}
          required
        />
        <AddFooter
          donorMode={donorMode}
          email={donorEmail}
          handleSubmit={handleSubmit}
          isDirty={isDirty}
          errors={errors}
        />
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
  innerContainer: {
    gridColumn: "span 3",
    gridTemplateColumns: "repeat(3, 1fr)",
    display: "grid",
    gap: 2,
  },
  title: {
    gridColumn: "span 3",
    mb: 1,
  },
  titleText: {
    fontWeight: "bold",
  },
  textField: {
    flex: 1,
  },
};
