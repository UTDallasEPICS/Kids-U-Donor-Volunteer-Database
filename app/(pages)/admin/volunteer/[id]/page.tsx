"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { DetailFooter } from "@/app/components/donations/detail-footer";
import {
  VolunteerFormProps,
  volunteerPreferences,
  volunteerApplicationStatuses,
} from "@/app/components/form-components/form-input-props";
import { FormInputTextfield } from "@/app/components/form-components/form-input-textfield";
import { FormInputDropdown } from "@/app/components/form-components/form-input-dropdown";
import { FormInputCheckbox } from "@/app/components/form-components/form-input-checkbox";
import { grey } from "@mui/material/colors";

export default function VolunteerDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const volunteerNameRef = useRef<string>("");

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { isDirty, isValid, errors },
  } = useForm<VolunteerFormProps>({
    mode: "onChange",
    defaultValues: {
      volunteer: {
        firstName: "",
        lastName: "",
        middleInitial: "",
        emailAddress: "",
        phoneNumber: "",
        addressLine: "",
        city: "",
        state: "",
        zipCode: "",
        businessOrSchoolName: "",
        volunteerPreference: "No preference",
        preferredRoles: [],
        availability: [],
        location: [],
        preferredEvents: [],
        usCitizen: false,
        driversLicense: false,
        reliableTransport: false,
        speakSpanish: false,
        referenceName: "",
        volunteerApplicationCompleted: false,
        backgroundCheckCompleted: false,
        codeOfEthicsFormSigned: false,
        abuseNeglectReportFormSigned: false,
        personnelPoliciesFormSigned: false,
        orientationCompleted: false,
        trainingModulesCompleted: false,
        volunteerApplicationStatus: "PENDING",
        registration: false,
        dateSubmitted: new Date(),
      },
    },
  });

  useEffect(() => {
    fetchVolunteerDetails();
  }, []);

  const fetchVolunteerDetails = async () => {
    try {
      const response = await fetch(`/api/admin/volunteer/${id}/get`);

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || "Something went wrong";
        throw new Error(message);
      }

      const { volunteer } = await response.json();

      volunteerNameRef.current = `${volunteer.firstName} ${volunteer.lastName}`;

      reset({
        volunteer: {
          firstName: volunteer.firstName || "",
          lastName: volunteer.lastName || "",
          middleInitial: volunteer.middleInitial || "",
          emailAddress: volunteer.emailAddress || "",
          phoneNumber: volunteer.phoneNumber || "",
          addressLine: volunteer.addressLine || "",
          city: volunteer.city || "",
          state: volunteer.state || "",
          zipCode: volunteer.zipCode || "",
          businessOrSchoolName: volunteer.businessOrSchoolName || "",
          volunteerPreference: volunteer.volunteerPreference || "No preference",
          preferredRoles: volunteer.preferredRoles || [],
          availability: volunteer.availability || [],
          location: volunteer.location || [],
          preferredEvents: volunteer.preferredEvents || [],
          usCitizen: volunteer.usCitizen || false,
          driversLicense: volunteer.driversLicense || false,
          reliableTransport: volunteer.reliableTransport || false,
          speakSpanish: volunteer.speakSpanish || false,
          referenceName: volunteer.referenceName || "",
          volunteerApplicationCompleted: volunteer.volunteerApplicationCompleted || false,
          backgroundCheckCompleted: volunteer.backgroundCheckCompleted || false,
          codeOfEthicsFormSigned: volunteer.codeOfEthicsFormSigned || false,
          abuseNeglectReportFormSigned: volunteer.abuseNeglectReportFormSigned || false,
          personnelPoliciesFormSigned: volunteer.personnelPoliciesFormSigned || false,
          orientationCompleted: volunteer.orientationCompleted || false,
          trainingModulesCompleted: volunteer.trainingModulesCompleted || false,
          volunteerApplicationStatus: volunteer.volunteerApplicationStatus || "PENDING",
          registration: volunteer.registration || false,
          dateSubmitted: volunteer.dateSubmitted ? new Date(volunteer.dateSubmitted) : new Date(),
        },
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching volunteer details:", error);
      router.push("/not-found");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box>
      <Box sx={styles.container} component="form">
        <Box sx={styles.title}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Volunteer Details
          </Typography>
          <Typography variant="h6" sx={{ color: grey[700] }}>
            {volunteerNameRef.current}
          </Typography>
        </Box>

        {/* Personal Information Section */}
        <Typography variant="h5" sx={styles.sectionTitle}>
          Personal Information
        </Typography>

        <FormInputTextfield
          name="volunteer.firstName"
          control={control}
          label="First Name"
          required={true}
          sx={styles.textField}
        />

        <FormInputTextfield
          name="volunteer.lastName"
          control={control}
          label="Last Name"
          required={true}
          sx={styles.textField}
        />

        <FormInputTextfield
          name="volunteer.middleInitial"
          control={control}
          label="Middle Initial"
          sx={styles.textField}
        />

        <FormInputTextfield
          name="volunteer.emailAddress"
          control={control}
          label="Email"
          required={true}
          type="email"
          sx={styles.textField}
        />

        <FormInputTextfield
          name="volunteer.phoneNumber"
          control={control}
          label="Phone"
          required={true}
          sx={styles.textField}
        />

        <FormInputTextfield
          name="volunteer.addressLine"
          control={control}
          label="Address"
          sx={styles.textField}
        />

        <FormInputTextfield
          name="volunteer.city"
          control={control}
          label="City"
          sx={styles.textField}
        />

        <FormInputTextfield
          name="volunteer.state"
          control={control}
          label="State"
          sx={styles.textField}
        />

        <FormInputTextfield
          name="volunteer.zipCode"
          control={control}
          label="Zip Code"
          sx={styles.textField}
        />

        {/* Work/Education Section */}
        <Typography variant="h5" sx={styles.sectionTitle}>
          Work/Education
        </Typography>

        <FormInputTextfield
          name="volunteer.businessOrSchoolName"
          control={control}
          label="Business/School Name"
          sx={styles.textField}
        />

        <FormInputTextfield
          name="volunteer.referenceName"
          control={control}
          label="Reference Name"
          sx={styles.textField}
        />

        {/* Preferences & Skills Section */}
        <Typography variant="h5" sx={styles.sectionTitle}>
          Preferences & Skills
        </Typography>

        <FormInputDropdown
          name="volunteer.volunteerPreference"
          control={control}
          label="Volunteer Preference"
          required={true}
          menuItems={volunteerPreferences}
          sx={styles.textField}
        />

        <FormInputTextfield
          name="volunteer.preferredRoles"
          control={control}
          label="Preferred Roles (comma-separated)"
          sx={styles.textField}
        />

        <FormInputTextfield
          name="volunteer.availability"
          control={control}
          label="Availability (comma-separated)"
          sx={styles.textField}
        />

        <FormInputTextfield
          name="volunteer.location"
          control={control}
          label="Preferred Locations (comma-separated)"
          sx={styles.textField}
        />

        <FormInputTextfield
          name="volunteer.preferredEvents"
          control={control}
          label="Preferred Events (comma-separated)"
          sx={styles.textField}
        />

        <FormInputCheckbox
          control={control}
          setValue={setValue}
          name="volunteer.usCitizen"
          label="US Citizen?"
        />

        <FormInputCheckbox
          control={control}
          setValue={setValue}
          name="volunteer.driversLicense"
          label="Has Driver's License?"
        />

        <FormInputCheckbox
          control={control}
          setValue={setValue}
          name="volunteer.reliableTransport"
          label="Reliable Transport?"
        />

        <FormInputCheckbox
          control={control}
          setValue={setValue}
          name="volunteer.speakSpanish"
          label="Speaks Spanish?"
        />

        {/* Compliance & Requirements Section */}
        <Typography variant="h5" sx={styles.sectionTitle}>
          Compliance & Requirements
        </Typography>

        <FormInputDropdown
          name="volunteer.volunteerApplicationStatus"
          control={control}
          label="Application Status"
          required={true}
          menuItems={volunteerApplicationStatuses}
          sx={styles.textField}
        />

        <FormInputCheckbox
          control={control}
          setValue={setValue}
          name="volunteer.registration"
          label="Registered?"
        />

        <FormInputCheckbox
          control={control}
          setValue={setValue}
          name="volunteer.volunteerApplicationCompleted"
          label="Application Completed?"
        />

        <FormInputCheckbox
          control={control}
          setValue={setValue}
          name="volunteer.backgroundCheckCompleted"
          label="Background Check Completed?"
        />

        <FormInputCheckbox
          control={control}
          setValue={setValue}
          name="volunteer.codeOfEthicsFormSigned"
          label="Code of Ethics Signed?"
        />

        <FormInputCheckbox
          control={control}
          setValue={setValue}
          name="volunteer.abuseNeglectReportFormSigned"
          label="Abuse/Neglect Report Signed?"
        />

        <FormInputCheckbox
          control={control}
          setValue={setValue}
          name="volunteer.personnelPoliciesFormSigned"
          label="Personnel Policies Signed?"
        />

        <FormInputCheckbox
          control={control}
          setValue={setValue}
          name="volunteer.orientationCompleted"
          label="Orientation Completed?"
        />

        <FormInputCheckbox
          control={control}
          setValue={setValue}
          name="volunteer.trainingModulesCompleted"
          label="Training Modules Completed?"
        />

        {/* Footer with Save/Cancel/Delete */}
        <DetailFooter
          id={id}
          name="volunteer"
          href="/admin/volunteer"
          apiUrl="/admin/volunteer"
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
  title: {
    gridColumn: "span 3",
    fontWeight: "bold",
    mb: 3,
  },
  sectionTitle: {
    gridColumn: "span 3",
    fontWeight: "bold",
    mt: 2,
    mb: 1,
    color: grey[800],
  },
  textField: {
    flex: 1,
  },
};