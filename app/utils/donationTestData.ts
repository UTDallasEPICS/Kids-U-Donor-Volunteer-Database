export type Donation = {
  id: string;
  type: string;
  amount: number;
  item: string | null;
  paymentMethod: string | null;
  campaign: string;
  fundDesignation: string;
  date: Date;
  recurrenceFrequency: string;
  source: string;
  isMatching: boolean;
  receiptSent: boolean;
  receiptNumber: string;
  isAnonymous: boolean;
  acknowledgementSent: boolean;
  donorId: string;
  //donor: Donor;
};

export type Donor = {
  id: string;
  type: string;
  communicationPreference: string;
  status: string;
  notes: string;
  isRetained: boolean;
  segment: string | null;
  donationIds: string[];
  personId: string;
  //person: Person;
};

export type Address = {
  id: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  zipCode: string;
  type: string;
  //personId: string;
  //person: Person;
  //Grantor: Grantor[];
};

export const donations: Donation[] = [
  {
    id: "0",
    type: "One-Time",
    amount: 150.75,
    item: null,
    paymentMethod: "Credit Card",
    campaign: "Food",
    fundDesignation: "General",
    date: new Date("2024-07-15"),
    recurrenceFrequency: "No",
    source: "Website",
    isMatching: true,
    receiptSent: true,
    receiptNumber: "123123",
    isAnonymous: false,
    acknowledgementSent: true,
    donorId: "0",
  },
  {
    id: "1",
    type: "In-Kind",
    amount: 199.99,
    item: "10 Bicycles",
    paymentMethod: null,
    campaign: "Movement",
    fundDesignation: "General",
    date: new Date("2024-07-15"),
    recurrenceFrequency: "No",
    source: "Website",
    isMatching: true,
    receiptSent: true,
    receiptNumber: "9999",
    isAnonymous: false,
    acknowledgementSent: true,
    donorId: "0",
  },
];

export const donors: Donor[] = [
  {
    id: "0",
    type: "Individual",
    communicationPreference: "Phone",
    status: "Active",
    notes: "Notes Notes Notes",
    isRetained: true,
    segment: "High-value donor",
    donationIds: ["1", "2"],
    personId: "0",
  },
];

export const persons: Person[] = [
  {
    id: "0",
    firstName: "Dilly",
    lastName: "Dally",
    emailAddress: "random@mail.com",
    phoneNumber: "123-456-7899",
  },
];

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string | null;
  //donor: Donor;
  //representative: Representative
  //address: Address | null
  //user: User | null
};
