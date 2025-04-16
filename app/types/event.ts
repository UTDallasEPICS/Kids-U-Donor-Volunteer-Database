export interface Event {
  id: string;
  name: string;
  schedule: Date;
  description: string;
  locationId: string | null;
  location?: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}
