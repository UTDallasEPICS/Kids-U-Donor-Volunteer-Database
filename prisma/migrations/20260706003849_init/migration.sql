-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "referralSource" TEXT
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "emailAddress" TEXT,
    "phoneNumber" TEXT,
    "website" TEXT,
    "pointOfContactName" TEXT,
    "pointOfContactTitle" TEXT,
    "referralSource" TEXT
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "personId" TEXT,
    "email" TEXT NOT NULL,
    "avatarPath" TEXT,
    "deletedAt" DATETIME,
    "password" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "verificationExpiry" DATETIME,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorCode" TEXT,
    "twoFactorExpiry" DATETIME,
    "resetToken" TEXT,
    "resetTokenExpiry" DATETIME,
    CONSTRAINT "User_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "personId" TEXT,
    "organizationId" TEXT,
    CONSTRAINT "Address_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Address_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Grantor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "websiteLink" TEXT,
    "communicationPreference" TEXT NOT NULL,
    "recognitionPreference" TEXT NOT NULL,
    "internalRelationshipManager" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "deletedAt" DATETIME,
    "status" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Grantor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Representative" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "positionTitle" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "grantorId" TEXT NOT NULL,
    CONSTRAINT "Representative_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Representative_grantorId_fkey" FOREIGN KEY ("grantorId") REFERENCES "Grantor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Grant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amountRequested" REAL NOT NULL,
    "amountAwarded" REAL NOT NULL DEFAULT 0,
    "purpose" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "isMultipleYears" BOOLEAN NOT NULL,
    "quarter" TEXT NOT NULL,
    "acknowledgementSent" BOOLEAN NOT NULL,
    "awardNotificationDate" DATETIME,
    "fundingArea" TEXT NOT NULL,
    "internalProposalDueDate" DATETIME,
    "proposalDueDate" DATETIME,
    "proposalSummary" TEXT,
    "proposalSubmissionDate" DATETIME,
    "applicationType" TEXT NOT NULL,
    "internalOwner" TEXT NOT NULL,
    "fundingRestriction" TEXT,
    "matchingRequirement" TEXT,
    "useArea" TEXT NOT NULL,
    "isEligibleForRenewal" BOOLEAN NOT NULL,
    "renewalApplicationDate" DATETIME,
    "renewalAwardStatus" TEXT
);

-- CreateTable
CREATE TABLE "GrantAttachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "grantId" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    CONSTRAINT "GrantAttachment_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "Grant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RepresentativeGrant" (
    "grantId" TEXT NOT NULL,
    "representativeId" TEXT NOT NULL,

    PRIMARY KEY ("grantId", "representativeId"),
    CONSTRAINT "RepresentativeGrant_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "Grant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RepresentativeGrant_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "Representative" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Donor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "communicationPreference" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "isRetained" BOOLEAN NOT NULL DEFAULT false,
    "isCorporateSponsor" BOOLEAN NOT NULL DEFAULT false,
    "supporterId" TEXT,
    "totalContributed" REAL,
    "lastPaymentReceived" DATETIME,
    "tags" TEXT,
    "anonymous" BOOLEAN,
    "personId" TEXT,
    "organizationId" TEXT,
    CONSTRAINT "Donor_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Donor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "item" TEXT,
    "paymentMethod" TEXT,
    "campaign" TEXT,
    "fundDesignation" TEXT NOT NULL,
    "recurringFrequency" TEXT,
    "date" DATETIME NOT NULL,
    "source" TEXT NOT NULL,
    "isMatching" BOOLEAN NOT NULL,
    "taxDeductibleAmount" REAL,
    "receiptSent" BOOLEAN,
    "receiptNumber" TEXT,
    "isAnonymous" BOOLEAN NOT NULL,
    "acknowledgementSent" BOOLEAN NOT NULL,
    "donorId" TEXT,
    CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dateSubmitted" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registration" BOOLEAN NOT NULL DEFAULT false,
    "firstName" TEXT NOT NULL,
    "middleInitial" TEXT,
    "lastName" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "usCitizen" BOOLEAN,
    "driversLicense" BOOLEAN,
    "reliableTransport" BOOLEAN,
    "speakSpanish" BOOLEAN,
    "referenceName" TEXT,
    "businessOrSchoolName" TEXT,
    "volunteerPreference" TEXT NOT NULL DEFAULT 'No preference',
    "preferredRoles" TEXT NOT NULL DEFAULT '[]',
    "availability" TEXT NOT NULL DEFAULT '[]',
    "location" TEXT NOT NULL DEFAULT '[]',
    "preferredEvents" TEXT NOT NULL DEFAULT '[]',
    "volunteerApplicationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "volunteerApplicationCompleted" BOOLEAN NOT NULL DEFAULT false,
    "codeOfEthicsFormSigned" BOOLEAN NOT NULL DEFAULT false,
    "abuseNeglectReportFormSigned" BOOLEAN NOT NULL DEFAULT false,
    "personnelPoliciesFormSigned" BOOLEAN NOT NULL DEFAULT false,
    "orientationCompleted" BOOLEAN NOT NULL DEFAULT false,
    "trainingModulesCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "applicationId" TEXT,
    "personId" TEXT,
    CONSTRAINT "Volunteer_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "VolunteerApplication" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Volunteer_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventHour" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "volunteerId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "loginTime" DATETIME NOT NULL,
    "logoutTime" DATETIME NOT NULL,
    CONSTRAINT "EventHour_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventHour_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    CONSTRAINT "EmergencyContact_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VolunteerAttendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hoursWorked" REAL NOT NULL,
    "checkInTime" DATETIME NOT NULL,
    "checkOutTime" DATETIME NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "VolunteerAttendance_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VolunteerAttendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VolunteerApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateSubmitted" DATETIME,
    "legalName" TEXT NOT NULL,
    "maidenName" TEXT,
    "ssn" TEXT NOT NULL,
    "preferredName" TEXT,
    "currentAddress" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "usCitizen" BOOLEAN NOT NULL,
    "driversLicense" BOOLEAN NOT NULL,
    "ownCar" BOOLEAN NOT NULL,
    "speakSpanish" BOOLEAN NOT NULL,
    "otherLanguages" TEXT,
    "heardAbout" TEXT,
    "emergencyContactName" TEXT NOT NULL,
    "emergencyContactPhone" TEXT NOT NULL,
    "professionalRefName" TEXT NOT NULL,
    "professionalRefPhone" TEXT NOT NULL,
    "personalRefName" TEXT NOT NULL,
    "personalRefPhone" TEXT NOT NULL,
    "educationLevel" TEXT NOT NULL,
    "highSchoolName" TEXT,
    "collegeName" TEXT,
    "degreeObtained" TEXT,
    "additionalInfo1" TEXT,
    "additionalInfo2" TEXT,
    "arrestedOrConvicted" BOOLEAN NOT NULL,
    "convictionExplanation" TEXT,
    "agreedToTerms" BOOLEAN NOT NULL,
    "eSignature" TEXT NOT NULL,
    "softdelete" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING'
);

-- CreateTable
CREATE TABLE "VolunteerBackgroundCheck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "county" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "agreedToBackgroundCheck" BOOLEAN NOT NULL,
    "eSignature" TEXT NOT NULL,
    "signatureDate" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "declineReason" TEXT,
    "volunteerId" TEXT,
    CONSTRAINT "VolunteerBackgroundCheck_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "schedule" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "locationId" TEXT,
    "volunteerId" TEXT,
    "bgCheckRequired" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Event_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventGroup" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "referrelSource" TEXT NOT NULL,
    "reasonForVolunteering" TEXT NOT NULL,
    "eSignature" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "EventRegistration_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "hours" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Orientation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "schedule" DATETIME NOT NULL,
    "capacity" INTEGER NOT NULL,
    "locationId" TEXT NOT NULL,
    "bgCheckRequired" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Orientation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VolunteerOrientationInvitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "volunteerId" TEXT NOT NULL,
    "meetingLink" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "firstEmailSentAt" DATETIME,
    "selectionDeadline" DATETIME,
    "initialEmailSentByUserId" TEXT,
    "confirmedAt" DATETIME,
    "confirmedAdminUserId" TEXT,
    "selectedSlotId" TEXT,
    CONSTRAINT "VolunteerOrientationInvitation_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VolunteerOrientationInvitation_initialEmailSentByUserId_fkey" FOREIGN KEY ("initialEmailSentByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "VolunteerOrientationInvitation_confirmedAdminUserId_fkey" FOREIGN KEY ("confirmedAdminUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "VolunteerOrientationInvitation_selectedSlotId_fkey" FOREIGN KEY ("selectedSlotId") REFERENCES "VolunteerOrientationSlot" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VolunteerOrientationSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitationId" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "bookedAt" DATETIME,
    "bookedByVolunteerId" TEXT,
    CONSTRAINT "VolunteerOrientationSlot_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "VolunteerOrientationInvitation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VolunteerOrientationSlot_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VolunteerOrientationSlot_bookedByVolunteerId_fkey" FOREIGN KEY ("bookedByVolunteerId") REFERENCES "Volunteer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Admin_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SuperAdmin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personId" TEXT,
    CONSTRAINT "SuperAdmin_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subjectLine" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "creationDateTime" DATETIME NOT NULL,
    "scheduledDateTime" DATETIME NOT NULL,
    "attachments" TEXT NOT NULL DEFAULT '[]',
    "adminId" TEXT NOT NULL,
    CONSTRAINT "Mail_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MailRecipient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipientType" TEXT NOT NULL,
    "deliveryStatus" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "mailId" TEXT NOT NULL,
    CONSTRAINT "MailRecipient_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MailRecipient_mailId_fkey" FOREIGN KEY ("mailId") REFERENCES "Mail" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MailLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipientType" TEXT NOT NULL,
    "to" TEXT,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderEmail" TEXT,
    "totalRecipients" INTEGER NOT NULL,
    "successCount" INTEGER NOT NULL,
    "failureCount" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "SentEmail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "volunteerId" TEXT NOT NULL,
    CONSTRAINT "SentEmail_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationToken_key" ON "User"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");

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
CREATE UNIQUE INDEX "Donor_supporterId_key" ON "Donor"("supporterId");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_personId_key" ON "Donor"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_organizationId_key" ON "Donor"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_personId_key" ON "Volunteer"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyContact_volunteerId_key" ON "EmergencyContact"("volunteerId");

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerBackgroundCheck_volunteerId_key" ON "VolunteerBackgroundCheck"("volunteerId");

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerOrientationInvitation_volunteerId_key" ON "VolunteerOrientationInvitation"("volunteerId");

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerOrientationInvitation_selectedSlotId_key" ON "VolunteerOrientationInvitation"("selectedSlotId");

-- CreateIndex
CREATE INDEX "VolunteerOrientationSlot_invitationId_startTime_idx" ON "VolunteerOrientationSlot"("invitationId", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerOrientationSlot_invitationId_startTime_adminUserId_key" ON "VolunteerOrientationSlot"("invitationId", "startTime", "adminUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SuperAdmin_personId_key" ON "SuperAdmin"("personId");
