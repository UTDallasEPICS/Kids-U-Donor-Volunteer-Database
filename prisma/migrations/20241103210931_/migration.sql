/*
  Warnings:

  - The primary key for the `Organization` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `City` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `Country` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `NotesAboutLoginInfo` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `OrganizationID` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `OrganizationName` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `PortalForGrantApplication` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `State` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `StreetAddress` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `WebsiteForFunder` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `Zipcode` on the `Organization` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[donorId]` on the table `Donation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId]` on the table `Donor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[emailAddress]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailAddress` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Organization` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Representative" DROP CONSTRAINT "Representative_OrganizationID_fkey";

-- DropIndex
DROP INDEX "Organization_OrganizationName_key";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "organizationId" TEXT,
ALTER COLUMN "addressLine2" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Donor" ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_pkey",
DROP COLUMN "City",
DROP COLUMN "Country",
DROP COLUMN "NotesAboutLoginInfo",
DROP COLUMN "OrganizationID",
DROP COLUMN "OrganizationName",
DROP COLUMN "PortalForGrantApplication",
DROP COLUMN "State",
DROP COLUMN "StreetAddress",
DROP COLUMN "WebsiteForFunder",
DROP COLUMN "Zipcode",
ADD COLUMN     "emailAddress" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD CONSTRAINT "Organization_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Address_organizationId_key" ON "Address"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_donorId_key" ON "Donation"("donorId");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_organizationId_key" ON "Donor"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_emailAddress_key" ON "Organization"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_phoneNumber_key" ON "Organization"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
