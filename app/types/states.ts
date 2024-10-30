import { Address, Donation, Donor } from "@prisma/client";

export type DonorState = {
  type: string;
  communicationPreference: string;
  status: string;
  notes: string;
  isRetained: boolean;
  segment: string | null;
};

export type PersonState = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string | null;
};

export type AddressState = {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  zipCode: string;
  type: string;
};

export type RequiredDonorPersonState = {
  firstName: boolean;
  lastName: boolean;
  emailAddress: boolean;
  addressLine1: boolean;
  city: boolean;
  zipCode: boolean;
  type: boolean;
};

export type RequiredDonationState = {
  amount: boolean;
  item: boolean;
  campaign: boolean;
  fundDesignation: boolean;
  receiptNumber: boolean;
};

export type DonationState = {
  type: string;
  amount: number;
  item: string | null;
  paymentMethod: string | null;
  campaign: string;
  fundDesignation: string;
  date: Date;
  recurringFrequency: string;
  source: string;
  isMatching: boolean;
  receiptSent: boolean;
  receiptNumber: string;
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
