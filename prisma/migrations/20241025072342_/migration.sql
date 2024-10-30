-- CreateTable
CREATE TABLE "Constituent" (
    "ConstituentID" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "StreetAddress" TEXT NOT NULL,
    "City" TEXT NOT NULL,
    "State" TEXT NOT NULL,
    "Zipcode" TEXT NOT NULL,
    "Country" TEXT NOT NULL,
    "EmailAddress" TEXT NOT NULL,
    "PhoneNumber" TEXT,
    "AreaCode" TEXT,

    CONSTRAINT "Constituent_pkey" PRIMARY KEY ("ConstituentID")
);

-- CreateTable
CREATE TABLE "Volunteer" (
    "VolunteerID" TEXT NOT NULL,
    "DOB" TIMESTAMP(3) NOT NULL,
    "Age" INTEGER NOT NULL,
    "EmergencyContact" TEXT,
    "EventsAttended" TEXT[],
    "AgreementToMediaUse" BOOLEAN,
    "TrainingCompletion" TEXT,
    "BackgroundCheckCompletion" BOOLEAN,
    "IsOverEighteen" BOOLEAN,
    "ConstituentID" TEXT NOT NULL,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("VolunteerID")
);

-- CreateTable
CREATE TABLE "Organization" (
    "OrganizationID" TEXT NOT NULL,
    "WebsiteForFunder" TEXT,
    "StreetAddress" TEXT NOT NULL,
    "City" TEXT NOT NULL,
    "State" TEXT NOT NULL,
    "Zipcode" TEXT NOT NULL,
    "Country" TEXT NOT NULL,
    "OrganizationName" TEXT NOT NULL,
    "PortalForGrantApplication" TEXT,
    "NotesAboutLoginInfo" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("OrganizationID")
);

-- CreateTable
CREATE TABLE "Representative" (
    "ID" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Phone" TEXT,
    "PositionInCompany" TEXT NOT NULL,
    "OrganizationID" TEXT NOT NULL,

    CONSTRAINT "Representative_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Grant" (
    "GrantID" TEXT NOT NULL,
    "GrantName" TEXT NOT NULL,
    "AwardStatus" TEXT NOT NULL,
    "GrantDueDate" TIMESTAMP(3) NOT NULL,
    "ContactType" TEXT NOT NULL,
    "FundingAreas" TEXT[],
    "KidsUProgram" TEXT[],
    "GrantOpeningDates" TIMESTAMP(3)[],
    "AskDate" TIMESTAMP(3),
    "AwardDate" TIMESTAMP(3),
    "ReportingDates" TIMESTAMP(3)[],
    "TypeOfReporting" TEXT,
    "DateToReapplyForGrant" TIMESTAMP(3),
    "WaitingPeriodToReapply" INTEGER,
    "FundingRestrictions" TEXT,
    "AskAmount" DOUBLE PRECISION NOT NULL,
    "AmountAwarded" DOUBLE PRECISION NOT NULL,
    "EndOfGrantReportDueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grant_pkey" PRIMARY KEY ("GrantID")
);

-- CreateTable
CREATE TABLE "Event" (
    "EventID" TEXT NOT NULL,
    "NameOfEvent" TEXT NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "Time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("EventID")
);

-- CreateTable
CREATE TABLE "VolunteerEvent" (
    "ID" TEXT NOT NULL,
    "VolunteerID" TEXT NOT NULL,
    "EventID" TEXT NOT NULL,
    "LoginTime" TIMESTAMP(3) NOT NULL,
    "LogoutTime" TIMESTAMP(3) NOT NULL,
    "LoggedHours" INTEGER NOT NULL,

    CONSTRAINT "VolunteerEvent_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "phoneNumber" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donor" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "communicationPreference" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "isRetained" BOOLEAN NOT NULL,
    "segment" TEXT,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "personId" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "item" TEXT,
    "paymentMethod" TEXT,
    "campaign" TEXT NOT NULL,
    "fundDesignation" TEXT NOT NULL,
    "recurringFrequency" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "isMatching" BOOLEAN NOT NULL,
    "receiptSent" BOOLEAN NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL,
    "acknowledgementSent" BOOLEAN NOT NULL,
    "donorId" TEXT NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GrantToRepresentative" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Constituent_EmailAddress_key" ON "Constituent"("EmailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Constituent_PhoneNumber_key" ON "Constituent"("PhoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_OrganizationName_key" ON "Organization"("OrganizationName");

-- CreateIndex
CREATE UNIQUE INDEX "Representative_Email_key" ON "Representative"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Representative_Phone_key" ON "Representative"("Phone");

-- CreateIndex
CREATE UNIQUE INDEX "Grant_GrantName_key" ON "Grant"("GrantName");

-- CreateIndex
CREATE UNIQUE INDEX "Person_emailAddress_key" ON "Person"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Person_phoneNumber_key" ON "Person"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_personId_key" ON "Donor"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_personId_key" ON "Address"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_donorId_key" ON "Donation"("donorId");

-- CreateIndex
CREATE UNIQUE INDEX "_GrantToRepresentative_AB_unique" ON "_GrantToRepresentative"("A", "B");

-- CreateIndex
CREATE INDEX "_GrantToRepresentative_B_index" ON "_GrantToRepresentative"("B");

-- AddForeignKey
ALTER TABLE "Volunteer" ADD CONSTRAINT "Volunteer_ConstituentID_fkey" FOREIGN KEY ("ConstituentID") REFERENCES "Constituent"("ConstituentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Representative" ADD CONSTRAINT "Representative_OrganizationID_fkey" FOREIGN KEY ("OrganizationID") REFERENCES "Organization"("OrganizationID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerEvent" ADD CONSTRAINT "VolunteerEvent_EventID_fkey" FOREIGN KEY ("EventID") REFERENCES "Event"("EventID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerEvent" ADD CONSTRAINT "VolunteerEvent_VolunteerID_fkey" FOREIGN KEY ("VolunteerID") REFERENCES "Volunteer"("VolunteerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GrantToRepresentative" ADD CONSTRAINT "_GrantToRepresentative_A_fkey" FOREIGN KEY ("A") REFERENCES "Grant"("GrantID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GrantToRepresentative" ADD CONSTRAINT "_GrantToRepresentative_B_fkey" FOREIGN KEY ("B") REFERENCES "Representative"("ID") ON DELETE CASCADE ON UPDATE CASCADE;
