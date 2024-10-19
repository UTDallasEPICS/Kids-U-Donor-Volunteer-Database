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
CREATE TABLE "Grantor" (
    "id" TEXT NOT NULL,
    "websiteLink" TEXT,
    "addressId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactTitle" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "communicationPreference" TEXT NOT NULL,
    "recognitionPreference" TEXT NOT NULL,
    "internalRelationshipManager" TEXT NOT NULL,

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
    "amountAwarded" DOUBLE PRECISION NOT NULL,
    "purpose" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isMultipleYears" BOOLEAN NOT NULL,
    "quarter" TEXT NOT NULL,
    "proposalSubmissionDate" TIMESTAMP(3) NOT NULL,
    "awardNotificationDate" TIMESTAMP(3) NOT NULL,
    "internalProposalDueDate" TIMESTAMP(3) NOT NULL,
    "proposalDueDate" TIMESTAMP(3) NOT NULL,
    "proposalSummary" TEXT NOT NULL,
    "applicationType" TEXT NOT NULL,
    "internalOwner" TEXT NOT NULL,
    "requiredAttachment" TEXT NOT NULL,
    "fundingRestriction" TEXT,
    "matchingRequirement" TEXT,
    "useArea" TEXT NOT NULL,
    "finalReportDueDate" TEXT NOT NULL,
    "programImpact" TEXT NOT NULL,
    "complianceRequirement" TEXT NOT NULL,
    "isSiteVisitRequired" BOOLEAN NOT NULL,
    "siteVisitDate" TIMESTAMP(3),
    "budgetAllocation" TEXT NOT NULL,
    "totalExpensesIncurred" DOUBLE PRECISION NOT NULL,
    "remainingBalance" DOUBLE PRECISION NOT NULL,
    "auditRequirement" TEXT,
    "isEligibleForRenewal" BOOLEAN NOT NULL,
    "renewalApplicationDate" TIMESTAMP(3) NOT NULL,
    "renewalAwardStatus" TEXT NOT NULL,
    "futureFundingOpportunities" TEXT NOT NULL,
    "programAlignment" TEXT NOT NULL,
    "proposalReviewDate" TIMESTAMP(3) NOT NULL,
    "reportReviewDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrantExpense" (
    "id" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GrantExpense_pkey" PRIMARY KEY ("id")
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
    "personId" TEXT NOT NULL,

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
    "amount" DOUBLE PRECISION,
    "item" TEXT,
    "paymentMethod" TEXT,
    "campaign" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "fundDesignation" TEXT NOT NULL,
    "recurringFrequency" TEXT,
    "source" TEXT NOT NULL,
    "isMatching" BOOLEAN NOT NULL,
    "donorId" TEXT NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_emailAddress_key" ON "Person"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Person_phoneNumber_key" ON "Person"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Grantor_name_key" ON "Grantor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Representative_personId_key" ON "Representative"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Grant_name_key" ON "Grant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_personId_key" ON "Donor"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_personId_key" ON "Address"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_donorId_key" ON "Donation"("donorId");

-- AddForeignKey
ALTER TABLE "Grantor" ADD CONSTRAINT "Grantor_id_fkey" FOREIGN KEY ("id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Representative" ADD CONSTRAINT "Representative_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Representative" ADD CONSTRAINT "Representative_grantorId_fkey" FOREIGN KEY ("grantorId") REFERENCES "Grantor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantExpense" ADD CONSTRAINT "GrantExpense_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "Grant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepresentativeGrant" ADD CONSTRAINT "RepresentativeGrant_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "Grant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepresentativeGrant" ADD CONSTRAINT "RepresentativeGrant_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "Representative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
