import {
  Grant as PGrant,
  Representative as PRepresentative,
  Event as PEvent,
  VolunteerEvent as PVolunteerEvent,
  Organization as POrganization,
  Donation as PDonation,
  Volunteer as PVolunteer,
  Constituent as PConstituent,
  Donor as PDonor,
} from '@prisma/client';

export type Grant = PGrant & {
  Representative: Representative[];
};

export type Representative = PRepresentative & {
  Organization: Organization;
  Grants: Grant[];
};

export type Event = PEvent & {
  VolunteersAtteneded: VolunteerEvent[];
};

export type VolunteerEvent = PVolunteerEvent & {
  Event: Event;
  Volunteer: Volunteer;
};

export type Organization = POrganization & {
  Representatives: Representative[];
};

export type Donation = PDonation & {
  Donor: Donor;
};

export type Volunteer = PVolunteer & {
  Constituent: Constituent;
  VolunteerEvents: VolunteerEvent[];
};

export type Constituent = PConstituent & {
  Donors: Donor[];
  Volunteers: Volunteer[];
};

export type Donor = PDonor & {
  Constituent: Constituent;
  Donations: Donation[];
};
