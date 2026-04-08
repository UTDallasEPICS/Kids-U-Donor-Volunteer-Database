-- DropIndex
DROP INDEX "Volunteer_emailAddress_idx";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "bgCheckRequired" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Orientation" ADD COLUMN     "bgCheckRequired" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "VolunteerBackgroundCheck" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
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
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "volunteerId" TEXT,

    CONSTRAINT "VolunteerBackgroundCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerBackgroundCheck_volunteerId_key" ON "VolunteerBackgroundCheck"("volunteerId");

-- AddForeignKey
ALTER TABLE "VolunteerBackgroundCheck" ADD CONSTRAINT "VolunteerBackgroundCheck_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
