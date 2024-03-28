/*
  Warnings:

  - You are about to drop the column `CompanySchoolName` on the `Constituent` table. All the data in the column will be lost.
  - You are about to drop the column `CompanySchoolName` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `RepresentativeName` on the `Representative` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[EmailAddress]` on the table `Constituent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[PhoneNumber]` on the table `Constituent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[GrantName]` on the table `Grant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[OrganizationName]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[RepresentativeEmail]` on the table `Representative` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[RepresentativePhone]` on the table `Representative` will be added. If there are existing duplicate values, this will fail.
  - Made the column `EmailAddress` on table `Constituent` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `OrganizationName` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `RepresentativeFirstName` to the `Representative` table without a default value. This is not possible if the table is not empty.
  - Added the required column `RepresentativeLastName` to the `Representative` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Constituent" DROP COLUMN "CompanySchoolName",
ALTER COLUMN "EmailAddress" SET NOT NULL;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "CompanySchoolName",
ADD COLUMN     "OrganizationName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Representative" DROP COLUMN "RepresentativeName",
ADD COLUMN     "RepresentativeFirstName" TEXT NOT NULL,
ADD COLUMN     "RepresentativeLastName" TEXT NOT NULL,
ALTER COLUMN "RepresentativeEmail" SET NOT NULL,
ALTER COLUMN "RepresentativeEmail" SET DATA TYPE TEXT,
ALTER COLUMN "RepresentativePhone" DROP NOT NULL,
ALTER COLUMN "RepresentativePhone" SET DATA TYPE TEXT,
ALTER COLUMN "PositionInCompany" SET NOT NULL,
ALTER COLUMN "PositionInCompany" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Constituent_EmailAddress_key" ON "Constituent"("EmailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Constituent_PhoneNumber_key" ON "Constituent"("PhoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Grant_GrantName_key" ON "Grant"("GrantName");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_OrganizationName_key" ON "Organization"("OrganizationName");

-- CreateIndex
CREATE UNIQUE INDEX "Representative_RepresentativeEmail_key" ON "Representative"("RepresentativeEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Representative_RepresentativePhone_key" ON "Representative"("RepresentativePhone");
