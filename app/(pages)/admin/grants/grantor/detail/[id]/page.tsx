"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { DetailFooter } from "@/app/components/donations/detail-footer";
import {
  GrantorFormProps,
  grantorTypes,
  grantorAddressTypes,
  grantorCommunicationPreferences,
  grantorRecognitionPreferences,
} from "@/app/components/form-components/form-input-props";
import { FormInputTextfield } from "@/app/components/form-components/form-input-textfield";
import { FormInputDropdown } from "@/app/components/form-components/form-input-dropdown";
import { grey } from "@mui/material/colors";

const mapGrantorType = (value: string): string => {
  const typeMap: Record<string, string> = {
    "Foundation": "Private Foundation",
    "Private Foundation": "Private Foundation",
    "Corporate Partner": "Corporate Partner",
    "Federal Government": "Federal Government",
    "State Government": "State Government",
    "Local Government": "Local Government",
    "Individual Major Donor": "Individual Major Donor",
  };
  return typeMap[value] || "Private Foundation";
};

const mapCommunicationPreference = (value: string): string => {
  const prefMap: Record<string, string> = {
    "Email": "Email",
    "Phone": "Phone",
    "In-person": "In-person",
    "Event Participation": "Event Participation",
    "Unknown": "Email",
  };
  return prefMap[value] || "Email";
};

const mapRecognitionPreference = (value: string): string => {
  const prefMap: Record<string, string> = {
    "Public Recognition": "Public Recognition",
    "Anonymous": "Anonymous",
    "None": "Public Recognition",
  };
  return prefMap[value] || "Public Recognition";
};

export default function GrantorDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const grantorNameRef = useRef<string>("");

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, errors },
  } = useForm<GrantorFormProps>({
    mode: "onChange",
    defaultValues: {
      grantor: {
        type: "",
        websiteLink: "",
        communicationPreference: "Email",
        recognitionPreference: "Public Recognition",
        internalRelationshipManager: "",
        organization: {
          name: "",
          emailAddress: "",
          address: {
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            zipCode: "",
            type: "Business",
          },
        },
      },
    },
  });

  useEffect(() => {
    fetchGrantorDetails();
  }, []);

  const fetchGrantorDetails = async () => {
    try {
      const response = await fetch(`/api/admin/grantors/get?id=${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || "Something went wrong";
        throw new Error(message);
      }

      const { data } = await response.json();

      grantorNameRef.current = data.organization?.name || "";

    reset({
        grantor: {
            type: mapGrantorType(data.type || "Private Foundation"),
            websiteLink: data.websiteLink || "",
            communicationPreference: mapCommunicationPreference(data.communicationPreference || "Email"),
            recognitionPreference: mapRecognitionPreference(data.recognitionPreference || "Public Recognition"),
            internalRelationshipManager: data.internalRelationshipManager || "",
            organization: {
            name: data.organization?.name || "",
            emailAddress: data.organization?.emailAddress || "",
            address: {
                addressLine1: data.organization?.address?.addressLine1 || "",
                addressLine2: data.organization?.address?.addressLine2 || "",
                city: data.organization?.address?.city || "",
                state: data.organization?.address?.state || "",
                zipCode: data.organization?.address?.zipCode || "",
                type: data.organization?.address?.type || "Business",
            },
            },
        },
    });

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching grantor details:", error);
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
            Grantor Details
          </Typography>
          <Typography variant="h6" sx={{ color: grey[700] }}>
            {grantorNameRef.current}
          </Typography>
        </Box>

        {/* Organization Information Section */}
        <Typography variant="h5" sx={styles.sectionTitle}>
          Organization Information
        </Typography>

        <FormInputTextfield
          name="grantor.organization.name"
          control={control}
          label="Organization Name"
          required={true}
          sx={styles.textField}
        />

        <FormInputTextfield
          name="grantor.organization.emailAddress"
          control={control}
          label="Email"
          type="email"
          sx={styles.textField}
        />

        <FormInputTextfield
          name="grantor.websiteLink"
          control={control}
          label="Website Link"
          sx={styles.textField}
        />

        {/* Address Section */}
        <Typography variant="h5" sx={styles.sectionTitle}>
          Address
        </Typography>

        <FormInputTextfield
          name="grantor.organization.address.addressLine1"
          control={control}
          label="Address Line 1"
          sx={styles.textField}
        />

        <FormInputTextfield
          name="grantor.organization.address.addressLine2"
          control={control}
          label="Address Line 2"
          sx={styles.textField}
        />

        <FormInputTextfield
          name="grantor.organization.address.city"
          control={control}
          label="City"
          sx={styles.textField}
        />

        <FormInputTextfield
          name="grantor.organization.address.state"
          control={control}
          label="State"
          sx={styles.textField}
        />

        <FormInputTextfield
          name="grantor.organization.address.zipCode"
          control={control}
          label="Zipcode"
          sx={styles.textField}
        />

        <FormInputDropdown
          name="grantor.organization.address.type"
          control={control}
          label="Address Type"
          menuItems={grantorAddressTypes}
          sx={styles.textField}
        />

        {/* Grantor Details Section */}
        <Typography variant="h5" sx={styles.sectionTitle}>
          Grantor Details
        </Typography>

        <FormInputDropdown
          name="grantor.type"
          control={control}
          label="Grantor Type"
          required={true}
          menuItems={grantorTypes}
          sx={styles.textField}
        />

        <FormInputDropdown
          name="grantor.communicationPreference"
          control={control}
          label="Communication Preference"
          required={true}
          menuItems={grantorCommunicationPreferences}
          sx={styles.textField}
        />

        <FormInputDropdown
          name="grantor.recognitionPreference"
          control={control}
          label="Recognition Preference"
          required={true}
          menuItems={grantorRecognitionPreferences}
          sx={styles.textField}
        />

        <FormInputTextfield
          name="grantor.internalRelationshipManager"
          control={control}
          label="Internal Relationship Manager"
          sx={styles.textField}
        />

        {/* Footer with Save/Cancel/Delete */}
        <DetailFooter
          id={id}
          name="grantor"
          href="/admin/grants/grantor"
          apiUrl="/admin/grantors"
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