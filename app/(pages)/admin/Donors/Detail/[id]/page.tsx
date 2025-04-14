"use client";
import { useParams, useRouter } from "next/navigation";
import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormInputTextfield } from "../../../../components/formComponents/FormInputTextfield";
import Loading from "@/app/loading";
import { addressTypes, DonorFormProps, statesChoices } from "@/app/components/formComponents/FormInputProps";
import { DonationTableState, DonorResponse } from "@/app/types/states";
import { FormInputDropdown } from "@/app/components/formComponents/FormInputDropdown";
import { donorCommPreferences, donorStatuses, donorTypes } from "@/app/components/formComponents/FormInputProps";
import { DetailFooter } from "@/app/components/donations/DetailFooter";
import { MiniDonationsTable } from "@/app/components/donations/MiniDonationTable";
import { grey } from "@mui/material/colors";
import { FormInputCheckbox } from "@/app/components/formComponents/FormInputCheckbox";

export default function DonorDetail() {
  const { id }: { id: string } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const personNameRef = useRef<string>("");
  const isOrgRef = useRef<boolean>(false);

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
    setValue,
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
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donors/${id}`, {
        method: "GET",
      });

      const { data } = (await result.json()) as DonorResponse;

      if (!result.ok) {
        const errorData = await result.json();
        const message = errorData?.message || "Something went wrong";
        throw new Error(message);
      }

      if (data.person) {
        personNameRef.current = `${data.person.firstName} ${data.person.lastName}`;
      }
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
        },
        organization: isOrgRef.current
          ? {
              name: data.organization.name || "",
              emailAddress: data.organization.emailAddress || "",
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
          <Box sx={styles.title}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Donor Details
            </Typography>
            <Typography variant="h6" sx={{ color: grey[700] }}>
              {personNameRef.current}
            </Typography>
          </Box>

          <FormInputDropdown
            name={"donor.type"}
            control={control}
            label={"Type"}
            required={true}
            readOnly={true}
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
                    {isOrgRef.current ? "Organization" : "Individual"} Details
                  </Typography>
                </Box>

                {isOrgRef.current ? (
                  <>
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
                  </>
                ) : (
                  <>
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
            )}
          />
          <DetailFooter
            id={id}
            name={"donor"}
            href={"/Donors"}
            apiUrl={"/donors"}
            handleSubmit={handleSubmit}
            isDirty={isDirty}
            errors={errors}
          />
          <Box sx={styles.title}>
            <Typography variant="h6" sx={styles.titleText}>
              Donor Lifetime Value (placeholder)
            </Typography>
          </Box>
          <Box sx={styles.title}>
            <Typography variant="h6" sx={styles.titleText}>
              Donation History
            </Typography>
          </Box>
          <Box sx={{ gridColumn: "span 3" }}>
            <MiniDonationsTable donations={donationInfo} />
          </Box>
        </Box>
      )}
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
