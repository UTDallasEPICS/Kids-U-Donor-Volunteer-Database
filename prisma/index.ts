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
  Donation as PDonation
} from "@prisma/client";

//import { Donor, Address, Donation } from "@prisma/client";

export type Grant = PGrant & {
  RepresentativeGrant: RepresentativeGrant[];
  GrantAttachment: GrantAttachment[];
};

export type GrantAttachment = PGrantAttachment & {
  Grantor: Grantor;
}

export type Grantor = PGrantor & {
  Organization: Organization;
  Representatives: Representative[];
};

export type Representative = PRepresentative & {
  Person: Person;
  Grantor: Grantor;
  RepresentativeGrant: RepresentativeGrant[];
};


export type RepresentativeGrant = PRepresentativeGrant & {
  Grants: Grant[];
  Representatives: Representative[];
};

export type Donation = PDonation & {
  Donor: Donor;
}

export type Donor = PDonor & {
  Donation: Donation[];
}

export type Organization = POrganization & {
  Grantor: Grantor;
  Address: Address;
  Donor: Donor;
};

export type Person = PPerson & {
  Donor: Donor;
  Representative: Representative;
  Address: Address;
  User: User;
};

export type User = PUser & {
  Person: Person;
}

export type Address = PAddress & {
  Person: Person;
  Organization: Organization;
}
