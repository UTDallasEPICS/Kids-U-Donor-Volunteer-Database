import {
  Person as PPerson,
  Organization as POrganization,
  Grant as PGrant,
  Representative as PRepresentative,
  Grantor as PGrantor,
  RepresentativeGrant as PRepresentativeGrant,
  Donor as PDonor,
  Donation as PDonation
} from "@prisma/client";

import { Donor, Address, Donation } from "@prisma/client";

export type Grant = PGrant & {
  Representative: Representative[];
};

export type Grantor = PGrantor & {
  Organization: Organization;
  Representative: Representative[];
};

export type Representative = PRepresentative & {
};


export type RepresentativeGrant = PRepresentativeGrant & {
  Grant: Grant;
  Representative: Representative;
};

export type Organization = POrganization & {
  Representatives: Representative[];
};

export type Person = PPerson & {
  Donors: Donor;
};
