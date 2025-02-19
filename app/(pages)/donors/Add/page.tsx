"use client";
import { Box, TextField, Typography } from "@mui/material";
import * as React from "react";
import { FormInputTextfield } from "@/app/components/form-components/form-input-textfield";
import { FormInputDropdown } from "@/app/components/form-components/form-input-dropdown";
import { Controller, useForm } from "react-hook-form";
import {
  addressTypes,
  donorCommPreferences,
  DonorFormProps,
  donorStatuses,
  donorTypes,
  statesChoices,
} from "@/app/components/form-components/form-input-props";
import { AddDonorFooter } from "@/app/components/donations/add/add-donor-footer";
import { FormInputCheckbox } from "@/app/components/form-components/form-input-checkbox";

export default function AddDonor() {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isDirty, isValid, errors },
  } = useForm<DonorFormProps>({
    mode: "onChange",
    defaultValues: {
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

  return (
    <Box sx={styles.container} component="form">
      <Box sx={styles.title}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Add Donor
        </Typography>
      </Box>
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
        <AddDonorFooter handleSubmit={handleSubmit} isDirty={isDirty} errors={errors} />
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
