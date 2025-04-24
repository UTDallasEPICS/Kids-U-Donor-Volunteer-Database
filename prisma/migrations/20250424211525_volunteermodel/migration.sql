/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `driversLicense` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `preferredName` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `referenceName` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `registration` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `reliableTransport` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `speakSpanish` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `ssn` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `usCitizen` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Volunteer` table. All the data in the column will be lost.
  - Made the column `phoneNumber` on table `Volunteer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Volunteer_emailAddress_key";

-- DropIndex
DROP INDEX "Volunteer_phoneNumber_key";

-- DropIndex
DROP INDEX "Volunteer_ssn_key";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "volunteerId" TEXT;

-- AlterTable
ALTER TABLE "Volunteer" DROP COLUMN "createdAt",
DROP COLUMN "driversLicense",
DROP COLUMN "password",
DROP COLUMN "preferredName",
DROP COLUMN "referenceName",
DROP COLUMN "registration",
DROP COLUMN "reliableTransport",
DROP COLUMN "speakSpanish",
DROP COLUMN "ssn",
DROP COLUMN "updatedAt",
DROP COLUMN "usCitizen",
DROP COLUMN "username",
ADD COLUMN     "abuseNeglectReportFormSigned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "applicationId" TEXT,
ADD COLUMN     "availability" TEXT[],
ADD COLUMN     "backgroundCheckCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "businessOrSchoolName" TEXT,
ADD COLUMN     "codeOfEthicsFormSigned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dateSubmitted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT[],
ADD COLUMN     "middleInitial" TEXT,
ADD COLUMN     "orientationCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "personnelPoliciesFormSigned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preferredEvents" TEXT[],
ADD COLUMN     "trainingModulesCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "volunteerApplicationCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "volunteerPreference" TEXT NOT NULL DEFAULT 'No preference',
ALTER COLUMN "phoneNumber" SET NOT NULL;

-- CreateTable
CREATE TABLE "EventHour" (
    "id" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "loginTime" TIMESTAMP(3) NOT NULL,
    "logoutTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventHour_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Volunteer" ADD CONSTRAINT "Volunteer_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "VolunteerApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventHour" ADD CONSTRAINT "EventHour_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventHour" ADD CONSTRAINT "EventHour_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
