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
  referralSources,
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
        isCorporateSponsor: false,
      },
      person: { firstName: "", lastName: "", emailAddress: "", phoneNumber: "", referralSource: "" },
      organization: { name: "", emailAddress: "", phoneNumber: "", website: "", pointOfContactName: "", pointOfContactTitle: "", referralSource: "" },
      address: { addressLine1: "", addressLine2: "", city: "", state: "", zipCode: "", type: "" },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Box sx={styles.container} component="form">
        <Box sx={styles.title}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2f4b7c" }}>
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
        <FormInputCheckbox
          control={control}
          setValue={setValue}
          name={"donor.isCorporateSponsor"}
          label={"Corporate Sponsor"}
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
                  <FormInputTextfield
                    name={"organization.phoneNumber"}
                    control={control}
                    label={"Phone Number"}
                    maxLength={12}
                    sx={styles.textField}
                  />
                  <FormInputTextfield
                    name={"organization.website"}
                    control={control}
                    label={"Website"}
                    sx={styles.textField}
                  />
                  <FormInputTextfield
                    name={"organization.pointOfContactName"}
                    control={control}
                    label={"Point of Contact Name"}
                    sx={styles.textField}
                  />
                  <FormInputTextfield
                    name={"organization.pointOfContactTitle"}
                    control={control}
                    label={"Point of Contact Title"}
                    sx={styles.textField}
                  />
                  <FormInputDropdown
                    name={"organization.referralSource"}
                    control={control}
                    label={"Referral Source"}
                    menuItems={referralSources}
                    sx={styles.textField}
                  />
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
                  <FormInputDropdown
                    name={"person.referralSource"}
                    control={control}
                    label={"Referral Source"}
                    menuItems={referralSources}
                    sx={styles.textField}
                  />
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
    </div>
  );
}

const styles = {
  container: {
    p: 4,
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 2,
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
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
