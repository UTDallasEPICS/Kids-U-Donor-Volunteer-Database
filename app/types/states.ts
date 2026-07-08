import { Address, Donation, Donor } from "@prisma/client";

export type DonorState = {
  type: string;
  communicationPreference: string;
  status: string;
  notes: string;
  isRetained: boolean;
  isCorporateSponsor: boolean;
};

export type OrganizationState = {
  name: string;
  emailAddress: string;
  phoneNumber?: string | null;
  website?: string | null;
  pointOfContactName?: string | null;
  pointOfContactTitle?: string | null;
  referralSource?: string | null;
  address?: AddressState | null;
};

export type PersonState = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string | null;
  referralSource?: string | null;
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

export type VolunteerState = {
  firstName: string;
  lastName: string;
  middleInitial: string;
  emailAddress: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  state: string;
  zipCode: string;
  businessOrSchoolName: string;
  volunteerPreference: string;
  preferredRoles: string[];
  availability: string[];
  location: string[];
  preferredEvents: string[];
  usCitizen: boolean;
  driversLicense: boolean;
  reliableTransport: boolean;
  speakSpanish: boolean;
  referenceName: string;
  volunteerApplicationCompleted: boolean;
  backgroundCheckCompleted: boolean;
  codeOfEthicsFormSigned: boolean;
  abuseNeglectReportFormSigned: boolean;
  personnelPoliciesFormSigned: boolean;
  orientationCompleted: boolean;
  trainingModulesCompleted: boolean;
  volunteerApplicationStatus: string;
  registration: boolean;
  dateSubmitted: Date;
};

export type GrantorOrganizationState = {
  name: string;
  emailAddress: string;
  address: AddressState;
};

export type GrantorState = {
  type: string;
  websiteLink: string;
  communicationPreference: string;
  recognitionPreference: string;
  internalRelationshipManager: string;
  organization: GrantorOrganizationState;
};

export type GrantState = {
  name: string;
  status: string;
  amountRequested: number;
  amountAwarded: number;
  purpose: string;
  startDate: Date | null;
  endDate: Date | null;
  isMultipleYears: boolean;
  quarter: string;
  acknowledgementSent: boolean;
  awardNotificationDate: Date;
  fundingArea: string;
  internalProposalDueDate: Date;
  proposalDueDate: Date | null;
  proposalSummary: string;
  proposalSubmissionDate: Date;
  applicationType: string;
  internalOwner: string;
  fundingRestriction: string;
  matchingRequirement: string;
  useArea: string;
  isEligibleForRenewal: boolean;
  renewalApplicationDate: Date;
  renewalAwardStatus: string;
};

export type DonationResponse = {
  data: Donation & {
    donor: {
      person?: {
        firstName: string;
        lastName: string;
      } | null;
      organization?: {
        name: string;
      } | null;
    } | null;
  };
};

export type DonorResponse = {
  data: Omit<Donor, 'donation'> & {
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
