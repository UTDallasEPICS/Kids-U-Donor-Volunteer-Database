-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VOLUNTEER', 'ADMIN');

-- CreateEnum
CREATE TYPE "RecipientType" AS ENUM ('PRIMARY', 'CC', 'BCC');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

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
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emailAddress" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "personId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "personId" TEXT,
    "organizationId" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grantor" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "websiteLink" TEXT,
    "communicationPreference" TEXT NOT NULL,
    "recognitionPreference" TEXT NOT NULL,
    "internalRelationshipManager" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Grantor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Representative" (
    "id" TEXT NOT NULL,
    "positionTitle" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "grantorId" TEXT NOT NULL,

    CONSTRAINT "Representative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amountRequested" DOUBLE PRECISION NOT NULL,
    "amountAwarded" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "purpose" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isMultipleYears" BOOLEAN NOT NULL,
    "quarter" TEXT NOT NULL,
    "acknowledgementSent" BOOLEAN NOT NULL,
    "awardNotificationDate" TIMESTAMP(3),
    "fundingArea" TEXT NOT NULL,
    "internalProposalDueDate" TIMESTAMP(3),
    "proposalDueDate" TIMESTAMP(3) NOT NULL,
    "proposalSummary" TEXT,
    "proposalSubmissionDate" TIMESTAMP(3),
    "applicationType" TEXT NOT NULL,
    "internalOwner" TEXT NOT NULL,
    "fundingRestriction" TEXT,
    "matchingRequirement" TEXT,
    "useArea" TEXT NOT NULL,
    "isEligibleForRenewal" BOOLEAN NOT NULL,
    "renewalApplicationDate" TIMESTAMP(3),
    "renewalAwardStatus" TEXT,

    CONSTRAINT "Grant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrantAttachment" (
    "id" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "document" TEXT NOT NULL,

    CONSTRAINT "GrantAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepresentativeGrant" (
    "grantId" TEXT NOT NULL,
    "representativeId" TEXT NOT NULL,

    CONSTRAINT "RepresentativeGrant_pkey" PRIMARY KEY ("grantId","representativeId")
);

-- CreateTable
CREATE TABLE "Donor" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "communicationPreference" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "isRetained" BOOLEAN NOT NULL,
    "personId" TEXT,
    "organizationId" TEXT,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "item" TEXT,
    "paymentMethod" TEXT,
    "campaign" TEXT,
    "fundDesignation" TEXT NOT NULL,
    "recurringFrequency" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "isMatching" BOOLEAN NOT NULL,
    "taxDeductibleAmount" DOUBLE PRECISION,
    "receiptSent" BOOLEAN,
    "receiptNumber" TEXT,
    "isAnonymous" BOOLEAN NOT NULL,
    "acknowledgementSent" BOOLEAN NOT NULL,
    "donorId" TEXT,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL,
    "ssn" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "preferredName" TEXT,
    "addressLine" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "usCitizen" BOOLEAN NOT NULL,
    "driversLicense" BOOLEAN NOT NULL,
    "reliableTransport" BOOLEAN NOT NULL,
    "speakSpanish" BOOLEAN NOT NULL,
    "referenceName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolunteerAttendance" (
    "id" TEXT NOT NULL,
    "hoursWorked" DOUBLE PRECISION NOT NULL,
    "checkInTime" TIMESTAMP(3) NOT NULL,
    "checkOutTime" TIMESTAMP(3) NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "VolunteerAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL,
    "eventGroup" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "referrelSource" TEXT NOT NULL,
    "reasonForVolunteering" TEXT NOT NULL,
    "eSignature" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "hours" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mail" (
    "id" TEXT NOT NULL,
    "subjectLine" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "creationDateTime" TIMESTAMP(3) NOT NULL,
    "scheduledDateTime" TIMESTAMP(3) NOT NULL,
    "attachments" TEXT[],
    "adminId" TEXT NOT NULL,

    CONSTRAINT "Mail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailRecipient" (
    "id" TEXT NOT NULL,
    "recipientType" "RecipientType" NOT NULL,
    "deliveryStatus" "DeliveryStatus" NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "mailId" TEXT NOT NULL,

    CONSTRAINT "MailRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_emailAddress_key" ON "Person"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Person_phoneNumber_key" ON "Person"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_emailAddress_key" ON "Organization"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_personId_key" ON "User"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_personId_key" ON "Address"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_organizationId_key" ON "Address"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Grantor_organizationId_key" ON "Grantor"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Representative_personId_key" ON "Representative"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Grant_name_key" ON "Grant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_personId_key" ON "Donor"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_organizationId_key" ON "Donor"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_ssn_key" ON "Volunteer"("ssn");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_emailAddress_key" ON "Volunteer"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_phoneNumber_key" ON "Volunteer"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyContact_volunteerId_key" ON "EmergencyContact"("volunteerId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grantor" ADD CONSTRAINT "Grantor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Representative" ADD CONSTRAINT "Representative_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Representative" ADD CONSTRAINT "Representative_grantorId_fkey" FOREIGN KEY ("grantorId") REFERENCES "Grantor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantAttachment" ADD CONSTRAINT "GrantAttachment_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "Grant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepresentativeGrant" ADD CONSTRAINT "RepresentativeGrant_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "Grant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepresentativeGrant" ADD CONSTRAINT "RepresentativeGrant_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "Representative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyContact" ADD CONSTRAINT "EmergencyContact_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerAttendance" ADD CONSTRAINT "VolunteerAttendance_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerAttendance" ADD CONSTRAINT "VolunteerAttendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mail" ADD CONSTRAINT "Mail_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailRecipient" ADD CONSTRAINT "MailRecipient_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailRecipient" ADD CONSTRAINT "MailRecipient_mailId_fkey" FOREIGN KEY ("mailId") REFERENCES "Mail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
