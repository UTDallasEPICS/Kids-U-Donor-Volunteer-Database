import { Prisma, PrismaClient } from "@prisma/client";

export async function seedBackgroundChecks(prisma: PrismaClient) {
  console.log("Adding mock VolunteerBackgroundCheck data...\n");

  const records: Prisma.VolunteerBackgroundCheckCreateInput[] = [
    {
      fullName: "Maria Gonzalez",
      dateOfBirth: new Date("1992-04-15"),
      county: "Dallas",
      addressLine: "412 Maple Ave",
      city: "Dallas",
      state: "TX",
      zipCode: "75201",
      race: "Hispanic or Latino",
      gender: "Female",
      agreedToBackgroundCheck: true,
      eSignature: "Maria Gonzalez",
      signatureDate: "03/20/2026",
      approved: false,
    },
    {
      fullName: "James Okafor",
      dateOfBirth: new Date("1988-11-02"),
      county: "Collin",
      addressLine: "87 Birchwood Dr",
      city: "Plano",
      state: "TX",
      zipCode: "75023",
      race: "Black or African American",
      gender: "Male",
      agreedToBackgroundCheck: true,
      eSignature: "James Okafor",
      signatureDate: "03/21/2026",
      approved: false,
    },
    {
      fullName: "Stephanie Chen",
      dateOfBirth: new Date("1995-07-28"),
      county: "Denton",
      addressLine: "1034 Lakeview Blvd",
      city: "Denton",
      state: "TX",
      zipCode: "76201",
      race: "Asian",
      gender: "Female",
      agreedToBackgroundCheck: true,
      eSignature: "Stephanie Chen",
      signatureDate: "03/22/2026",
      approved: false,
    },
    {
      fullName: "Tyler Brooks",
      dateOfBirth: new Date("1990-02-10"),
      county: "Tarrant",
      addressLine: "559 Elmwood St",
      city: "Fort Worth",
      state: "TX",
      zipCode: "76104",
      race: "White",
      gender: "Male",
      agreedToBackgroundCheck: true,
      eSignature: "Tyler Brooks",
      signatureDate: "03/23/2026",
      approved: false,
    },
    {
      fullName: "Aisha Patel",
      dateOfBirth: new Date("1997-09-14"),
      county: "Dallas",
      addressLine: "228 Rosewood Lane",
      city: "Irving",
      state: "TX",
      zipCode: "75061",
      race: "Asian",
      gender: "Female",
      agreedToBackgroundCheck: true,
      eSignature: "Aisha Patel",
      signatureDate: "03/24/2026",
      approved: false,
    },
  ];

  for (const record of records) {
    const existing = await prisma.volunteerBackgroundCheck.findFirst({
      where: {
        fullName: record.fullName,
        signatureDate: record.signatureDate,
      },
      select: { id: true },
    });

    if (existing) {
      console.log(`Skipping: ${record.fullName} — already exists.`);
      continue;
    }

    const created = await prisma.volunteerBackgroundCheck.create({ data: record });
    console.log(`Created: ${created.fullName} (ID: ${created.id})`);
  }

  console.log("\nDone. 5 background check records added.");
}
