import { Control } from "react-hook-form";
import { SxProps, Theme } from "@mui/material";
import { AddressState, DonationState, DonorState, OrganizationState, PersonState } from "@/app/types/states";

export type MenuItem = {
  label: string;
  value: string;
};

export type CheckBoxItem = {
  label: string;
  value: boolean;
};

export type DonationFormProps = {
  donation: DonationState;
};

export type DonorFormProps = {
  donor: DonorState;
  person?: PersonState;
  organization?: OrganizationState;
  address: AddressState;
};

export type AddDonationDonorFormProps = DonationFormProps & DonorFormProps;

export type FormInputProps = {
  name: string;
  control?: Control<any>;
  label: string;
  required?: boolean;
  setValue?: any;
  readOnly?: boolean;
  sx?: SxProps<Theme>;
};

export type FormInputTextProps = FormInputProps & {
  maxLength?: number;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  type?: string;
};

export type FormInputSelectProps = FormInputProps & {
  menuItems: MenuItem[];
};

export const donorTypes: MenuItem[] = [
  {
    label: "Individual",
    value: "Individual",
  },
  {
    label: "Corporate",
    value: "Corporate",
  },
  {
    label: "Foundation",
    value: "Foundation",
  },
];

export const donorCommPreferences: MenuItem[] = [
  {
    label: "Email",
    value: "Email",
  },
  {
    label: "Mail",
    value: "Mail",
  },
  {
    label: "Phone",
    value: "Phone",
  },
];

export const donorStatuses: MenuItem[] = [
  {
    label: "Active",
    value: "Active",
  },
  {
    label: "Lapsed",
    value: "Lapsed",
  },
  {
    label: "Major Donor",
    value: "Major Donor",
  },
  {
    label: "First Time Donor",
    value: "First Time Donor",
  },
];

export const donorSegments: MenuItem[] = [
  {
    label: "High Value Donor",
    value: "High Value Donor",
  },
  {
    label: "Lapsed",
    value: "Lapsed",
  },
  {
    label: "First Time Donor",
    value: "First Time Donor",
  },
];

export const addressTypes: MenuItem[] = [
  {
    label: "Residential",
    value: "Residential",
  },
  {
    label: "Commercial",
    value: "Commercial",
  },
];

export const statesChoices: MenuItem[] = [
  { value: "AL", label: "AL - Alabama" },
  { value: "AK", label: "AK - Alaska" },
  { value: "AZ", label: "AZ - Arizona" },
  { value: "AR", label: "AR - Arkansas" },
  { value: "CA", label: "CA - California" },
  { value: "CO", label: "CO - Colorado" },
  { value: "CT", label: "CT - Connecticut" },
  { value: "DE", label: "DE - Delaware" },
  { value: "DC", label: "DC - District Of Columbia" },
  { value: "FL", label: "FL - Florida" },
  { value: "GA", label: "GA - Georgia" },
  { value: "HI", label: "HI - Hawaii" },
  { value: "ID", label: "ID - Idaho" },
  { value: "IL", label: "IL - Illinois" },
  { value: "IN", label: "IN - Indiana" },
  { value: "IA", label: "IA - Iowa" },
  { value: "KS", label: "KS - Kansas" },
  { value: "KY", label: "KY - Kentucky" },
  { value: "LA", label: "LA - Louisiana" },
  { value: "ME", label: "ME - Maine" },
  { value: "MD", label: "MD - Maryland" },
  { value: "MA", label: "MA - Massachusetts" },
  { value: "MI", label: "MI - Michigan" },
  { value: "MN", label: "MN - Minnesota" },
  { value: "MS", label: "MS - Mississippi" },
  { value: "MO", label: "MO - Missouri" },
  { value: "MT", label: "MT - Montana" },
  { value: "NE", label: "NE - Nebraska" },
  { value: "NV", label: "NV - Nevada" },
  { value: "NH", label: "NH - New Hampshire" },
  { value: "NJ", label: "NJ - New Jersey" },
  { value: "NM", label: "NM - New Mexico" },
  { value: "NY", label: "NY - New York" },
  { value: "NC", label: "NC - North Carolina" },
  { value: "ND", label: "ND - North Dakota" },
  { value: "OH", label: "OH - Ohio" },
  { value: "OK", label: "OK - Oklahoma" },
  { value: "OR", label: "OR - Oregon" },
  { value: "PA", label: "PA - Pennsylvania" },
  { value: "PR", label: "PR - Puerto Rico" },
  { value: "RI", label: "RI - Rhode Island" },
  { value: "SC", label: "SC - South Carolina" },
  { value: "SD", label: "SD - South Dakota" },
  { value: "TN", label: "TN - Tennessee" },
  { value: "TX", label: "TX - Texas" },
  { value: "UT", label: "UT - Utah" },
  { value: "VT", label: "VT - Vermont" },
  { value: "VI", label: "VI - Virgin Islands" },
  { value: "VA", label: "VA - Virginia" },
  { value: "WA", label: "WA - Washington" },
  { value: "WV", label: "WV - West Virginia" },
  { value: "WI", label: "WI - Wisconsin" },
  { value: "WY", label: "WY - Wyoming" },
];

export const donationTypes: MenuItem[] = [
  {
    label: "One-Time",
    value: "One-Time",
  },
  {
    label: "Recurring",
    value: "Recurring",
  },
  {
    label: "Pledge",
    value: "Pledge",
  },
  {
    label: "In-Kind",
    value: "In-Kind",
  },
];

export const paymentMethods: MenuItem[] = [
  {
    label: "Credit Card",
    value: "Credit Card",
  },
  {
    label: "Check",
    value: "Check",
  },
  {
    label: "Bank Transfer",
    value: "Bank Transfer",
  },
  {
    label: "Cash",
    value: "Cash",
  },
  {
    label: "ACH",
    value: "ACH",
  },
  {
    label: "PayPal",
    value: "PayPal",
  },
  {
    label: "Venmo",
    value: "Venmo",
  },
  {
    label: "Zelle",
    value: "Zelle",
  },
];

export const recurringFrequencies: MenuItem[] = [
  {
    label: "None",
    value: "None",
  },
  {
    label: "Monthly",
    value: "Monthly",
  },
  {
    label: "Quarterly",
    value: "Quarterly",
  },
  {
    label: "Annually",
    value: "Annually",
  },
];

export const donationSources: MenuItem[] = [
  {
    label: "Website",
    value: "Website",
  },
  {
    label: "Social Media",
    value: "Social Media",
  },
  {
    label: "Event",
    value: "Event",
  },
  {
    label: "Email",
    value: "Email",
  },
  {
    label: "Direct Mail",
    value: "Direct Mail",
  },
  {
    label: "Referral",
    value: "Referral",
  },
  {
    label: "Other",
    value: "Other",
  },
];

export const donorModes: MenuItem[] = [
  { label: "Anonymous", value: "Anonymous" },
  { label: "New", value: "New" },
  { label: "Existing", value: "Existing" },
];
