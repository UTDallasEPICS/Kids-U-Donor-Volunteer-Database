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
CREATE TABLE "Donor" (
    "DonorID" TEXT NOT NULL,
    "ContactPreference" TEXT,
    "NotesResources" TEXT,
    "ConstituentID" TEXT NOT NULL,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("DonorID")
);

-- CreateTable
CREATE TABLE "Donation" (
    "DonationID" TEXT NOT NULL,
    "AmountDonated" DOUBLE PRECISION NOT NULL,
    "DateReceived" TIMESTAMP(3) NOT NULL,
    "FundingAreas" TEXT[],
    "KidsUPrograms" TEXT[],
    "DueDate" TIMESTAMP(3),
    "DonorID" TEXT NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("DonationID")
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
    "RepresentativeID" TEXT NOT NULL,
    "RepresentativeFirstName" TEXT NOT NULL,
    "RepresentativeLastName" TEXT NOT NULL,
    "RepresentativeEmail" TEXT NOT NULL,
    "RepresentativePhone" TEXT,
    "PositionInCompany" TEXT NOT NULL,
    "OrganizationID" TEXT NOT NULL,

    CONSTRAINT "Representative_pkey" PRIMARY KEY ("RepresentativeID")
);

-- CreateTable
CREATE TABLE "Grant" (
    "GrantID" TEXT NOT NULL,
    "GrantName" TEXT NOT NULL,
    "Years" INTEGER NOT NULL,
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
CREATE UNIQUE INDEX "Representative_RepresentativeEmail_key" ON "Representative"("RepresentativeEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Representative_RepresentativePhone_key" ON "Representative"("RepresentativePhone");

-- CreateIndex
CREATE UNIQUE INDEX "Grant_GrantName_key" ON "Grant"("GrantName");

-- CreateIndex
CREATE UNIQUE INDEX "_GrantToRepresentative_AB_unique" ON "_GrantToRepresentative"("A", "B");

-- CreateIndex
CREATE INDEX "_GrantToRepresentative_B_index" ON "_GrantToRepresentative"("B");

-- AddForeignKey
ALTER TABLE "Volunteer" ADD CONSTRAINT "Volunteer_ConstituentID_fkey" FOREIGN KEY ("ConstituentID") REFERENCES "Constituent"("ConstituentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_ConstituentID_fkey" FOREIGN KEY ("ConstituentID") REFERENCES "Constituent"("ConstituentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_DonorID_fkey" FOREIGN KEY ("DonorID") REFERENCES "Donor"("DonorID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Representative" ADD CONSTRAINT "Representative_OrganizationID_fkey" FOREIGN KEY ("OrganizationID") REFERENCES "Organization"("OrganizationID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerEvent" ADD CONSTRAINT "VolunteerEvent_EventID_fkey" FOREIGN KEY ("EventID") REFERENCES "Event"("EventID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerEvent" ADD CONSTRAINT "VolunteerEvent_VolunteerID_fkey" FOREIGN KEY ("VolunteerID") REFERENCES "Volunteer"("VolunteerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GrantToRepresentative" ADD CONSTRAINT "_GrantToRepresentative_A_fkey" FOREIGN KEY ("A") REFERENCES "Grant"("GrantID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GrantToRepresentative" ADD CONSTRAINT "_GrantToRepresentative_B_fkey" FOREIGN KEY ("B") REFERENCES "Representative"("RepresentativeID") ON DELETE CASCADE ON UPDATE CASCADE;
