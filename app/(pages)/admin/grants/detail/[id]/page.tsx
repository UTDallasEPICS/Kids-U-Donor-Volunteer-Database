"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Box, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { DetailFooter } from "@/app/components/donations/detail-footer";
import {
  GrantFormProps,
  grantStatuses,
  grantPurposes,
  grantFundingAreas,
  grantUseAreas,
  grantQuarters,
  grantRenewalStatuses,
} from "@/app/components/form-components/form-input-props";
import { FormInputTextfield } from "@/app/components/form-components/form-input-textfield";
import { FormInputDropdown } from "@/app/components/form-components/form-input-dropdown";
import { FormInputCheckbox } from "@/app/components/form-components/form-input-checkbox";
import { FormInputDate } from "@/app/components/form-components/form-input-date";
import { grey } from "@mui/material/colors";

export default function GrantDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const grantNameRef = useRef<string>("");
  const [contactInfo, setContactInfo] = useState({
    grantorName: "",
    representativeName: "",
    representativeEmail: "",
    representativePhone: "",
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { isDirty, errors },
  } = useForm<GrantFormProps>({
    mode: "onChange",
    defaultValues: {
      grant: {
        name: "",
        status: "Pending",
        amountRequested: 0,
        amountAwarded: 0,
        purpose: "General",
        startDate: null,
        endDate: null,
        isMultipleYears: false,
        quarter: "1",
        acknowledgementSent: false,
        awardNotificationDate: new Date(),
        fundingArea: "General",
        internalProposalDueDate: new Date(),
        proposalDueDate: null,
        proposalSummary: "",
        proposalSubmissionDate: new Date(),
        applicationType: "",
        internalOwner: "",
        fundingRestriction: "",
        matchingRequirement: "",
        useArea: "General",
        isEligibleForRenewal: false,
        renewalApplicationDate: new Date(),
        renewalAwardStatus: "",
      },
    },
  });

  useEffect(() => {
    fetchGrantDetails();
  }, []);

  const fetchGrantDetails = async () => {
    try {
      const response = await fetch(`/api/admin/grants/${id}/get`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Something went wrong");
      }

      const { data } = await response.json();

      grantNameRef.current = data.name || "";

      const rep = data.representativeGrant?.[0]?.representative;
      setContactInfo({
        grantorName: rep?.grantor?.organization?.name || "",
        representativeName: rep?.person
          ? `${rep.person.firstName} ${rep.person.lastName}`
          : "",
        representativeEmail: rep?.person?.emailAddress || "",
        representativePhone: rep?.person?.phoneNumber || "",
      });

      const today = new Date();
      reset({
        grant: {
          name: data.name || "",
          status: data.status || "Pending",
          amountRequested: data.amountRequested ?? 0,
          amountAwarded: data.amountAwarded ?? 0,
          purpose: data.purpose || "General",
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          isMultipleYears: data.isMultipleYears ?? false,
          quarter: data.quarter || "1",
          acknowledgementSent: data.acknowledgementSent ?? false,
          awardNotificationDate: data.awardNotificationDate
            ? new Date(data.awardNotificationDate)
            : today,
          fundingArea: data.fundingArea || "General",
          internalProposalDueDate: data.internalProposalDueDate
            ? new Date(data.internalProposalDueDate)
            : today,
          proposalDueDate: data.proposalDueDate
            ? new Date(data.proposalDueDate)
            : null,
          proposalSummary: data.proposalSummary || "",
          proposalSubmissionDate: data.proposalSubmissionDate
            ? new Date(data.proposalSubmissionDate)
            : today,
          applicationType: data.applicationType || "",
          internalOwner: data.internalOwner || "",
          fundingRestriction: data.fundingRestriction || "",
          matchingRequirement: data.matchingRequirement || "",
          useArea: data.useArea || "General",
          isEligibleForRenewal: data.isEligibleForRenewal ?? false,
          renewalApplicationDate: data.renewalApplicationDate
            ? new Date(data.renewalApplicationDate)
            : today,
          renewalAwardStatus: data.renewalAwardStatus || "",
        },
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching grant details:", error);
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
            Grant Details
          </Typography>
          <Typography variant="h6" sx={{ color: grey[700] }}>
            {grantNameRef.current}
          </Typography>
        </Box>

        {/* Grantor & Contact (read-only) */}
        <Typography variant="h5" sx={styles.sectionTitle}>
          Grantor & Contact
        </Typography>

        <TextField label="Grantor" value={contactInfo.grantorName} disabled sx={styles.textField} />
        <TextField label="Representative" value={contactInfo.representativeName} disabled sx={styles.textField} />
        <TextField label="Representative Email" value={contactInfo.representativeEmail} disabled sx={styles.textField} />
        <TextField label="Representative Phone" value={contactInfo.representativePhone} disabled sx={styles.textField} />

        {/* Grant Information */}
        <Typography variant="h5" sx={styles.sectionTitle}>
          Grant Information
        </Typography>

        <FormInputTextfield name="grant.name" control={control} label="Grant Name" required={true} sx={styles.textField} />
        <FormInputDropdown name="grant.status" control={control} label="Status" required={true} menuItems={grantStatuses} sx={styles.textField} />
        <FormInputTextfield name="grant.applicationType" control={control} label="Application Type" sx={styles.textField} />
        <FormInputTextfield name="grant.internalOwner" control={control} label="Internal Owner" sx={styles.textField} />
        <FormInputDropdown name="grant.quarter" control={control} label="Quarter" menuItems={grantQuarters} sx={styles.textField} />

        {/* Financials */}
        <Typography variant="h5" sx={styles.sectionTitle}>
          Financials
        </Typography>

        <FormInputTextfield name="grant.amountRequested" control={control} label="Amount Requested" type="currency" sx={styles.textField} />
        <FormInputTextfield name="grant.amountAwarded" control={control} label="Amount Awarded" type="currency" sx={styles.textField} />
        <FormInputDropdown name="grant.purpose" control={control} label="Purpose" menuItems={grantPurposes} sx={styles.textField} />
        <FormInputTextfield name="grant.fundingArea" control={control} label="Funding Area" sx={styles.textField} />
        <FormInputTextfield name="grant.useArea" control={control} label="Use Area" sx={styles.textField} />
        <FormInputTextfield name="grant.fundingRestriction" control={control} label="Funding Restriction" sx={styles.textField} />
        <FormInputTextfield name="grant.matchingRequirement" control={control} label="Matching Requirement" sx={styles.textField} />

        {/* Dates */}
        <Typography variant="h5" sx={styles.sectionTitle}>
          Dates
        </Typography>

        <FormInputDate name="grant.startDate" control={control} label="Start Date" required={true} sx={styles.textField} />
        <FormInputDate name="grant.endDate" control={control} label="End Date" required={true} sx={styles.textField} />
        <FormInputDate name="grant.proposalDueDate" control={control} label="Proposal Due Date" required={true} sx={styles.textField} />
        <FormInputDate name="grant.internalProposalDueDate" control={control} label="Internal Proposal Due Date" sx={styles.textField} />
        <FormInputDate name="grant.proposalSubmissionDate" control={control} label="Proposal Submission Date" sx={styles.textField} />
        <FormInputDate name="grant.awardNotificationDate" control={control} label="Award Notification Date" sx={styles.textField} />
        <FormInputDate name="grant.renewalApplicationDate" control={control} label="Renewal Application Date" sx={styles.textField} />

        {/* Proposal */}
        <Typography variant="h5" sx={styles.sectionTitle}>
          Proposal
        </Typography>

        <Box sx={{ gridColumn: "span 3" }}>
          <FormInputTextfield
            name="grant.proposalSummary"
            control={control}
            label="Proposal Summary"
            multiline={true}
            rows={4}
            fullWidth={true}
            sx={styles.textField}
          />
        </Box>

        {/* Status Flags */}
        <Typography variant="h5" sx={styles.sectionTitle}>
          Status Flags
        </Typography>

        <FormInputCheckbox control={control} setValue={setValue} name="grant.isMultipleYears" label="Multi-Year Grant?" />
        <FormInputCheckbox control={control} setValue={setValue} name="grant.acknowledgementSent" label="Acknowledgement Sent?" />
        <FormInputCheckbox control={control} setValue={setValue} name="grant.isEligibleForRenewal" label="Eligible for Renewal?" />
        <FormInputDropdown name="grant.renewalAwardStatus" control={control} label="Renewal Award Status" menuItems={grantRenewalStatuses} sx={styles.textField} />

        <DetailFooter
          id={id}
          name="grant"
          href="/admin/grants"
          apiUrl="/admin/grants"
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
