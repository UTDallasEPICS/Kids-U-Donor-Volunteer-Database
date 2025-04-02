import {
  Person as PPerson,
  Organization as POrganization,
  User as PUser,
  Address as PAddress,
  Grant as PGrant,
  GrantAttachment as PGrantAttachment,
  Representative as PRepresentative,
  Grantor as PGrantor,
  RepresentativeGrant as PRepresentativeGrant,
  Donor as PDonor,
  Donation as PDonation,
  Volunteer as PVolunteer,
} from "@prisma/client";

//import { Donor, Address, Donation } from "@prisma/client";

export type Grant = PGrant & {
  representativeGrant: RepresentativeGrant[];
  grantAttachment: GrantAttachment[];
};

export type GrantAttachment = PGrantAttachment & {
  grantor: Grantor;
};

export type Grantor = PGrantor & {
  organization: Organization;
  representatives: Representative[];
};

export type Volunteer = PVolunteer;
/*& {
  volunteerAttendances: VolunteerAttendance[];
  eventRegistrations: EventRegistration[];
  mailRecipients: mailRecipients[];
}*/

export type Representative = PRepresentative & {
  person: Person;
  grantor: Grantor;
  representativeGrant: RepresentativeGrant[];
};

export type RepresentativeGrant = PRepresentativeGrant & {
  grant: Grant;
  representative: Representative;
};

export type Donation = PDonation & {
  donor: Donor;
};

export type Donor = PDonor & {
  donations: Donation[];
  person: Person;
  organization: Organization;
};

export type Organization = POrganization & {
  grantor: Grantor;
  address: Address;
  donor: Donor;
};

export type Person = PPerson & {
  donor: Donor;
  representative: Representative;
  address: Address;
  user: User;
};

export type User = PUser & {
  person: Person;
};

export type Address = PAddress & {
  person: Person;
  organization: Organization;
};
