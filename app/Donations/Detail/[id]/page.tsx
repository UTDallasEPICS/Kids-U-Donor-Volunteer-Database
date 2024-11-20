"use client";
import { useParams } from "next/navigation";
import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { DonationResponse } from "@/app/types/states";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { Footer } from "@/app/components/DonationHandleFooter";
import {
  choiceYesOrNo,
  DonationFormProps,
  donationSources,
  donationTypes,
  paymentMethods,
  recurringFrequencies,
} from "@/app/components/formComponents/FormInputProps";
import { Controller, useForm } from "react-hook-form";
import { FormInputDropdown } from "@/app/components/formComponents/FormInputDropdown";
import { FormInputTextfield } from "@/app/components/formComponents/FormInputTextfield";
import { FormInputDate } from "@/app/components/formComponents/FormInputDate";

export default function DonationDetail() {
  const { id }: { id: string } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const donorNameRef = useRef<string>("");

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid, errors },
  } = useForm<DonationFormProps>({
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
        recurringFrequency: "None",
        source: "",
        isMatching: false,
        taxDeductibleAmount: 0,
        receiptSent: false,
        receiptNumber: "",
        isAnonymous: false,
        acknowledgementSent: false,
      },
    },
  });

  useEffect(() => {
    fetchDonation();
  }, []);

  const fetchDonation = async () => {
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/donations/${id}`,
        {
          method: "GET",
        }
      );

      const { data } = (await result.json()) as DonationResponse;

      if (!result.ok) {
        router.push("/not-found");
        throw new Error("Error fetching donation");
      }

      donorNameRef.current = `${data.donor.person.firstName} ${data.donor.person.lastName}`;

      reset({
        donation: {
          type: data.type,
          amount: data.amount || 0,
          item: data?.item,
          paymentMethod: data.paymentMethod,
          campaign: data.campaign,
          fundDesignation: data.fundDesignation,
          date: data.date,
          recurringFrequency: data.recurringFrequency,
          source: data.source,
          isMatching: data.isMatching,
          taxDeductibleAmount: data?.taxDeductibleAmount || 0,
          receiptSent: data.receiptSent,
          receiptNumber: data.receiptNumber,
          isAnonymous: data.isAnonymous,
          acknowledgementSent: data.acknowledgementSent,
        },
      });

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      {isLoading ? (
        <Loading />
      ) : (
        <Box sx={styles.container} component="form">
          <Typography variant="h6">
            Donation Details for: {donorNameRef.current}
          </Typography>
          <Box sx={styles.inputContainer}>
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
                const label =
                  value !== "In-Kind" ? "Donation Amount" : "Item(s) Worth";
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
                    menuItems={paymentMethods}
                    sx={styles.textField}
                  />
                ) : (
                  <FormInputTextfield
                    name={"donation.item"}
                    control={control}
                    label={"Item(s)"}
                    required={true}
                    sx={styles.textField}
                  />
                )
              }
            />
          </Box>

          <Box sx={styles.inputContainer}>
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
            <FormInputDate
              name={"donation.date"}
              control={control}
              label={"Date"}
              required={true}
              sx={styles.textField}
            />
          </Box>

          <Box sx={styles.inputContainer}>
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
            <FormInputDropdown
              name={"donation.isMatching"}
              control={control}
              required={true}
              label={"Matching Donation?"}
              menuItems={choiceYesOrNo}
              sx={styles.textField}
            />
          </Box>

          <Typography variant="h6">Tax Information</Typography>

          <Box sx={styles.inputContainer}>
            <FormInputTextfield
              name={"donation.taxDeductibleAmount"}
              control={control}
              label={"Tax Deductible Amount"}
              type={"currency"}
              required={true}
              sx={styles.textField}
            />
            <FormInputDropdown
              name={"donation.receiptSent"}
              control={control}
              label={"Receipt Sent?"}
              readOnly={true}
              menuItems={choiceYesOrNo}
              sx={styles.textField}
            />
            <FormInputTextfield
              name={"donation.receiptNumber"}
              control={control}
              label={"Receipt Number"}
              readOnly={true}
              sx={styles.textField}
            />
          </Box>

          <Box sx={styles.inputContainer}>
            <FormInputDropdown
              name={"donation.isAnonymous"}
              control={control}
              label={"Anonymous?"}
              required={true}
              menuItems={choiceYesOrNo}
              sx={styles.textField}
            />
            <FormInputDropdown
              name={"donation.acknowledgementSent"}
              control={control}
              label={"Acknowledgement Sent?"}
              required={true}
              menuItems={choiceYesOrNo}
              sx={styles.textField}
            />
            <TextField
              sx={{ ...styles.textField, visibility: "hidden" }}
              id="style"
              label="styling"
            />
          </Box>
          <Footer
            id={id}
            name={"donation"}
            href={"/Donations"}
            apiUrl={"/v1/donations"}
            handleSubmit={handleSubmit}
            isDirty={isDirty}
            errors={errors}
          />
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
