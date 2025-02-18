"use client";
import { useParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { DonationResponse } from "@/app/types/states";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { DetailFooter } from "@/app/components/donations/detail-footer";
import {
  DonationFormProps,
  donationSources,
  donationTypes,
  paymentMethods,
  recurringFrequencies,
} from "@/app/components/form-components/form-input-props";
import { Controller, useForm } from "react-hook-form";
import { FormInputDropdown } from "@/app/components/form-components/form-input-dropdown";
import { FormInputTextfield } from "@/app/components/form-components/form-input-textfield";
import { FormInputDate } from "@/app/components/form-components/form-input-date";
import { grey } from "@mui/material/colors";
import { FormInputCheckbox } from "@/app/components/form-components/form-input-checkbox";

export default function DonationDetail() {
  const { id }: { id: string } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const donorNameRef = useRef<string>("");
  const isAnonymousRef = useRef<boolean>(false);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
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
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donations/${id}`, {
        method: "GET",
      });

      const { data } = (await result.json()) as DonationResponse;

      if (!result.ok) {
        const errorData = await result.json();
        const message = errorData?.message || "Something went wrong";
        throw new Error(message);
      }

      if (data.donor && !data.isAnonymous) {
        donorNameRef.current = `${data.donor.person.firstName} ${data.donor.person.lastName}`;
      }
      isAnonymousRef.current = data.isAnonymous;

      reset({
        donation: {
          type: data.type || "One-Time",
          amount: data.amount || 0,
          item: data?.item || "",
          paymentMethod: data.paymentMethod || "Credit Card",
          campaign: data.campaign || "",
          fundDesignation: data.fundDesignation || "",
          date: data.date || new Date(),
          recurringFrequency: data.recurringFrequency || "None",
          source: data.source || "Website",
          isMatching: data.isMatching || false,
          taxDeductibleAmount: data?.taxDeductibleAmount || 0,
          receiptSent: data.receiptSent || false,
          receiptNumber: data.receiptNumber || "",
          isAnonymous: data.isAnonymous || false,
          acknowledgementSent: data.acknowledgementSent || false,
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
              Donation Details
            </Typography>
            <Typography variant="h6" sx={{ color: grey[700] }}>
              {isAnonymousRef.current ? "Anonymous Donor" : donorNameRef.current}
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

          <Typography variant="h5" sx={styles.title}>
            Tax Information
          </Typography>

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
            name={"donation.receiptSent"}
            label={"Receipt Sent?"}
            required
          />
          <FormInputTextfield
            name={"donation.receiptNumber"}
            control={control}
            label={"Receipt Number"}
            readOnly={true}
            sx={styles.textField}
          />
          <FormInputCheckbox
            control={control}
            setValue={setValue}
            name={"donation.isAnonymous"}
            label={"Anonymous?"}
            readOnly={true}
          />
          <FormInputCheckbox
            control={control}
            setValue={setValue}
            name={"donation.acknowledgementSent"}
            label={"Acknowledgement Sent?"}
            required
          />
          <DetailFooter
            id={id}
            name={"donation"}
            href={"/Donations"}
            apiUrl={"/donations"}
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
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 2,
    width: "100%",
  },
  title: {
    gridColumn: "span 3",
    fontWeight: "bold",
    mb: 1,
  },
  textField: {
    flex: 1,
  },
};
