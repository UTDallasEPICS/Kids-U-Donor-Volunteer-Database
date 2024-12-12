type Grantor = {
  id: string;
  websiteLink: string | null;
  addressId: string;
  name: string;
  contactTitle: string;
  type: string;
  communicationPreference: string;
  recognitionPreference: string;
  internalRelationshipManager: string;
  // representative              Representative[]
  // address                     Address          @relation(fields: [id], references: [id])
};

export const grantors: Grantor[] = [
  {
    id: "1",
    websiteLink: "www.ron.business",
    addressId: "9319 Chisholm Trail",
    name: "gonzalooooooo",
    contactTitle: "Assistant Manager",
    type: "Organization",
    communicationPreference: "the telly",
    recognitionPreference: "recognizer",
    internalRelationshipManager: "Jeanie Aird",
  },
  {
    id: "2",
    websiteLink: "www.utrejects.com",
    addressId: "The White House",
    name: "Saanvi",
    contactTitle: "CEO",
    type: "Company",
    communicationPreference: "teleprompter",
    recognitionPreference: "recognizer",
    internalRelationshipManager: "Taz",
  },
  
];

/*

model Representative {
  id                  String                @id @default(uuid())
  positionTitle       String
  personId            String                @unique
  grantorId           String
  person              Person                @relation(fields: [personId], references: [id])
  grantor             Grantor               @relation(fields: [grantorId], references: [id])
  representativeGrant RepresentativeGrant[]
}




  }*/
