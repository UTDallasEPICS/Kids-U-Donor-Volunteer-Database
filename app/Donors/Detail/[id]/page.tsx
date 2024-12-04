"use client";
import { useParams, useRouter } from "next/navigation";
import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormInputTextfield } from "../../../components/formComponents/FormInputTextfield";
import Loading from "@/app/loading";
import { addressTypes, DonorFormProps, statesChoices } from "@/app/components/formComponents/FormInputProps";
import { DonationTableState, DonorResponse } from "@/app/types/states";
import { FormInputDropdown } from "@/app/components/formComponents/FormInputDropdown";
import {
  donorCommPreferences,
  donorSegments,
  donorStatuses,
  donorTypes,
  choiceYesOrNo,
} from "@/app/components/formComponents/FormInputProps";
import { Footer } from "@/app/components/donations/DonationHandleFooter";
import { MiniDonationsTable } from "@/app/components/donations/MiniDonationTable";
import { grey } from "@mui/material/colors";

export default function DonorDetail() {
  const { id }: { id: string } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const personNameRef = useRef<string>("");
  const isOrgRef = useRef<boolean>(false);

  /**
   * personal notes stuff
   *  IF TYPE IS CHANGED AND SAVED, REFRESH PAGE FOR NEW DATA
   *  singleton prismax
   *  */

  const [donationInfo, setDonationInfo] = useState<DonationTableState[]>([
    {
      id: "",
      type: "",
      amount: 0,
      item: "",
      paymentMethod: "",
      date: new Date(),
    },
  ]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid, errors },
  } = useForm<DonorFormProps>({
    mode: "onChange",
    defaultValues: {
      donor: undefined,
      person: undefined,
      organization: undefined,
      address: undefined,
    },
  });

  useEffect(() => {
    fetchDonor();
  }, []);

  const fetchDonor = async () => {
    try {
      const result = await fetch(`/api/v1/donors/${id}`, {
        method: "GET",
      });

      const { data } = (await result.json()) as DonorResponse;

      if (!result.ok) {
        router.push("/not-found");
        throw new Error("Error fetching donor");
      }

      personNameRef.current = `${data.person.firstName} ${data.person.lastName}`;
      isOrgRef.current = data.organization !== null || data.type === "Corporate" || data.type === "Foundation";

      setDonationInfo(
        data.donation.map((donation) => ({
          id: donation.id,
          type: donation.type || "One-Time",
          amount: donation.amount || 0,
          item: donation.item || "placeholder",
          paymentMethod: donation.paymentMethod || "placeholder",
          date: new Date(donation.date) || new Date(),
        }))
      );

      reset({
        donor: {
          type: data.type || "Individual",
          communicationPreference: data.communicationPreference || "Email",
          status: data.status || "Active",
          notes: data.notes || "",
          isRetained: data.isRetained || false,
          segment: data.segment || "High Value Donor",
        },
        organization: isOrgRef.current
          ? {
              name: data.organization.name || "",
              emailAddress: data.organization.emailAddress || "",
              phoneNumber: data.organization.phoneNumber || "",
            }
          : {},
        person: isOrgRef.current
          ? {}
          : {
              firstName: data.person.firstName || "",
              lastName: data.person.lastName || "",
              emailAddress: data.person.emailAddress || "",
              phoneNumber: data.person?.phoneNumber || "",
            },
        address: isOrgRef.current
          ? {
              addressLine1: data.organization.address?.addressLine1 || "",
              addressLine2: data.organization.address?.addressLine2 || "",
              city: data.organization.address?.city || "",
              state: data.organization.address?.state || "",
              zipCode: data.organization.address?.zipCode || "",
              type: data.organization.address?.type || "",
            }
          : {
              addressLine1: data.person.address?.addressLine1 || "",
              addressLine2: data.person.address?.addressLine2 || "",
              city: data.person.address?.city || "",
              state: data.person.address?.state,
              zipCode: data.person.address?.zipCode || "",
              type: data.person.address?.type || "Residential",
            },
      });

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      router.push("/not-found");
    }
  };

  return (
    <Box>
      {isLoading ? (
        <Loading />
      ) : (
        <Box sx={styles.container} component="form">
          <Box sx={{ paddingBottom: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Donor Details
            </Typography>
            <Typography variant="h6" sx={{ color: grey[700] }}>
              {personNameRef.current}
            </Typography>
          </Box>

          <Box sx={styles.inputContainer}>
            <FormInputDropdown
              name={"donor.type"}
              control={control}
              label={"Type"}
              required={true}
              menuItems={donorTypes}
              sx={styles.textField}
            />
            <FormInputDropdown
              name={"donor.communicationPreference"}
              control={control}
              label={"Communication Preference"}
              required={true}
              menuItems={donorCommPreferences}
              sx={styles.textField}
            />
            <FormInputDropdown
              name={"donor.status"}
              control={control}
              label={"Status"}
              required={true}
              menuItems={donorStatuses}
              sx={styles.textField}
            />
          </Box>

          <Box sx={styles.inputContainer}>
            <FormInputDropdown
              name={"donor.isRetained"}
              control={control}
              label={"Retention"}
              required={true}
              menuItems={choiceYesOrNo}
              sx={styles.textField}
            />
            <FormInputDropdown
              name={"donor.segment"}
              control={control}
              label={"Segmentation"}
              required={true}
              menuItems={donorSegments}
              sx={styles.textField}
            />
            <TextField sx={{ ...styles.textField, visibility: "hidden" }} label="styling" />
          </Box>

          <Typography variant="h6">Donor Notes</Typography>
          <Box sx={styles.inputContainer}>
            <FormInputTextfield
              name={"donor.notes"}
              control={control}
              label={"Notes"}
              multiline={true}
              rows={5}
              fullWidth={true}
              sx={styles.textField}
            />
          </Box>

          <Controller
            name="donor.type"
            control={control}
            render={({ field: { value } }) => (
              <Box>
                <Typography variant="h6">{isOrgRef.current ? "Organization" : "Individual"} Details</Typography>
                {isOrgRef.current ? (
                  <Box>
                    <Box sx={styles.inputContainer}>
                      <FormInputTextfield
                        name={"organization.name"}
                        control={control}
                        label={"Name"}
                        required={true}
                        sx={styles.textField}
                      />
                      <FormInputTextfield
                        name={"organization.emailAddress"}
                        control={control}
                        label={"Email Address"}
                        required={true}
                        sx={styles.textField}
                      />
                      <FormInputTextfield
                        name={"organization.phoneNumber"}
                        control={control}
                        label={"Phone Number"}
                        maxLength={12}
                        sx={styles.textField}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Box sx={styles.inputContainer}>
                      <FormInputTextfield
                        name={"person.firstName"}
                        control={control}
                        label={"First Name"}
                        required={true}
                        sx={styles.textField}
                      />
                      <FormInputTextfield
                        name={"person.lastName"}
                        control={control}
                        label={"Last Name"}
                        required={true}
                        sx={styles.textField}
                      />
                      <FormInputTextfield
                        name={"person.emailAddress"}
                        control={control}
                        label={"Email Address"}
                        required={true}
                        sx={styles.textField}
                      />
                    </Box>

                    <Box sx={styles.inputContainer}>
                      <FormInputTextfield
                        name={"person.phoneNumber"}
                        control={control}
                        label={"Phone Number"}
                        maxLength={12}
                        sx={styles.textField}
                      />
                      <TextField sx={{ ...styles.textField, visibility: "hidden" }} label="styling" />
                      <TextField sx={{ ...styles.textField, visibility: "hidden" }} label="styling" />
                    </Box>
                  </Box>
                )}
                <Box sx={styles.inputContainer}>
                  <FormInputTextfield
                    name={"address.addressLine1"}
                    control={control}
                    label={"Address Line 1"}
                    required={true}
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
                    required={true}
                    sx={styles.textField}
                  />
                </Box>

                <Box sx={styles.inputContainer}>
                  <FormInputDropdown
                    name={"address.state"}
                    control={control}
                    label={"State"}
                    required={true}
                    menuItems={statesChoices}
                    sx={styles.textField}
                  />
                  <FormInputTextfield
                    name={"address.zipCode"}
                    control={control}
                    label={"Zip Code"}
                    required={true}
                    sx={styles.textField}
                    type="zip"
                  />
                  <FormInputDropdown
                    name={"address.type"}
                    control={control}
                    label={"Type"}
                    required={true}
                    menuItems={addressTypes}
                    sx={styles.textField}
                  />
                </Box>
              </Box>
            )}
          />
          <Footer
            id={id}
            name={"donor"}
            href={"/Donors"}
            apiUrl={"/donors"}
            handleSubmit={handleSubmit}
            isDirty={isDirty}
            errors={errors}
          />
          <Typography variant="h6">Donor Lifetime Value (placeholder)</Typography>
          <Typography variant="h6">Donation History</Typography>
          <MiniDonationsTable donations={donationInfo} />
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
