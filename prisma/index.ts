import {
  Grant as PGrant,
  Representative as PRepresentative,
  Event as PEvent,
  VolunteerEvent as PVolunteerEvent,
  Organization as POrganization,
  Volunteer as PVolunteer,
  Constituent as PConstituent,
} from "@prisma/client";

import { Donor, Address, Donation } from "@prisma/client";

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

export type Volunteer = PVolunteer & {
  Constituent: Constituent;
  VolunteerEvents: VolunteerEvent[];
};

export type Constituent = PConstituent & {
  Donors: Donor[];
  Volunteers: Volunteer[];
};
