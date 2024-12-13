import { Address, Donation, Donor } from "@prisma/client";

export type DonorState = {
  type: string;
  communicationPreference: string;
  status: string;
  notes: string;
  isRetained: boolean;
};

export type OrganizationState = {
  name: string;
  emailAddress: string;
};

export type PersonState = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string | null;
};

export type AddressState = {
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  zipCode: string;
  type: string;
};

export type DonationState = {
  type: string;
  amount: number;
  item?: string | null;
  paymentMethod?: string | null;
  campaign: string;
  fundDesignation: string;
  date: Date;
  recurringFrequency: string;
  source: string;
  isMatching: boolean;
  taxDeductibleAmount?: number | null;
  receiptSent?: boolean | null;
  receiptNumber?: string | null;
  isAnonymous: boolean;
  acknowledgementSent: boolean;
};

export type DonationResponse = {
  data: Donation & {
    donor: {
      person: {
        firstName: string;
        lastName: string;
      };
    };
  };
};

export type DonorResponse = {
  data: Donor & {
    person: {
      firstName: string;
      lastName: string;
      emailAddress: string;
      phoneNumber?: string | null;
      address?: Address | null;
    };
    donation: {
      id: string;
      type: string;
      amount: number;
      item?: string | null;
      paymentMethod?: string | null;
      date: Date;
    }[];
    organization: {
      name: string;
      emailAddress: string;
      address?: Address | null;
    };
  };
};

export type DonationTableState = {
  id: string;
  type: string;
  amount: number;
  item: string;
  paymentMethod: string;
  date: Date;
};

////////

export type donorResponse = {
  data: Donor & {
    person: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      emailAddress: string;
      address: Address;
    };
    donation: {
      id: string;
      type: string;
      amount: number;
      item: string;
      paymentMethod: string;
    };
  };
};
