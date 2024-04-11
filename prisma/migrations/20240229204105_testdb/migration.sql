-- CreateTable
CREATE TABLE "Constituent" (
    "ConstituentID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "EmailAddress" TEXT,
    "PhoneNumber" TEXT,
    "CompanySchoolName" TEXT,

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
    "OrganizationID" SERIAL NOT NULL,
    "PositionInCompany" TEXT,
    "WebsiteForFunder" TEXT,
    "PortalForGrantApplication" TEXT,
    "NotesAboutLoginInfo" TEXT,
    "ConstituentID" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("OrganizationID")
);

-- CreateTable
CREATE TABLE "Grant" (
    "GrantID" SERIAL NOT NULL,
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
    "OrganizationID" INTEGER NOT NULL,

    CONSTRAINT "Grant_pkey" PRIMARY KEY ("GrantID")
);

-- CreateTable
CREATE TABLE "Event" (
    "EventID" SERIAL NOT NULL,
    "NameOfEvent" TEXT NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "Time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("EventID")
);

-- CreateTable
CREATE TABLE "VolunteerEvent" (
    "ID" SERIAL NOT NULL,
    "VolunteerID" TEXT NOT NULL,
    "EventID" INTEGER NOT NULL,
    "LoginTime" TIMESTAMP(3) NOT NULL,
    "LogoutTime" TIMESTAMP(3) NOT NULL,
    "LoggedHours" INTEGER NOT NULL,

    CONSTRAINT "VolunteerEvent_pkey" PRIMARY KEY ("ID")
);

-- AddForeignKey
ALTER TABLE "Volunteer" ADD CONSTRAINT "Volunteer_ConstituentID_fkey" FOREIGN KEY ("ConstituentID") REFERENCES "Constituent"("ConstituentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_ConstituentID_fkey" FOREIGN KEY ("ConstituentID") REFERENCES "Constituent"("ConstituentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_DonorID_fkey" FOREIGN KEY ("DonorID") REFERENCES "Donor"("DonorID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_ConstituentID_fkey" FOREIGN KEY ("ConstituentID") REFERENCES "Constituent"("ConstituentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_OrganizationID_fkey" FOREIGN KEY ("OrganizationID") REFERENCES "Organization"("OrganizationID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerEvent" ADD CONSTRAINT "VolunteerEvent_VolunteerID_fkey" FOREIGN KEY ("VolunteerID") REFERENCES "Volunteer"("VolunteerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerEvent" ADD CONSTRAINT "VolunteerEvent_EventID_fkey" FOREIGN KEY ("EventID") REFERENCES "Event"("EventID") ON DELETE RESTRICT ON UPDATE CASCADE;
