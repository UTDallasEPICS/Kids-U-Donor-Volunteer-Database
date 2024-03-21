/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Grant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `OrganizationID` on the `Grant` table. All the data in the column will be lost.
  - The primary key for the `Organization` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ConstituentID` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `PositionInCompany` on the `Organization` table. All the data in the column will be lost.
  - The primary key for the `VolunteerEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `City` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Country` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `State` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StreetAddress` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Zipcode` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Grant" DROP CONSTRAINT "Grant_OrganizationID_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_ConstituentID_fkey";

-- DropForeignKey
ALTER TABLE "VolunteerEvent" DROP CONSTRAINT "VolunteerEvent_EventID_fkey";

-- AlterTable
ALTER TABLE "Constituent" ADD COLUMN     "AreaCode" TEXT;

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
ALTER COLUMN "EventID" DROP DEFAULT,
ALTER COLUMN "EventID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("EventID");
DROP SEQUENCE "Event_EventID_seq";

-- AlterTable
ALTER TABLE "Grant" DROP CONSTRAINT "Grant_pkey",
DROP COLUMN "OrganizationID",
ALTER COLUMN "GrantID" DROP DEFAULT,
ALTER COLUMN "GrantID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Grant_pkey" PRIMARY KEY ("GrantID");
DROP SEQUENCE "Grant_GrantID_seq";

-- AlterTable
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_pkey",
DROP COLUMN "ConstituentID",
DROP COLUMN "PositionInCompany",
ADD COLUMN     "City" TEXT NOT NULL,
ADD COLUMN     "CompanySchoolName" TEXT,
ADD COLUMN     "Country" TEXT NOT NULL,
ADD COLUMN     "State" TEXT NOT NULL,
ADD COLUMN     "StreetAddress" TEXT NOT NULL,
ADD COLUMN     "Zipcode" TEXT NOT NULL,
ALTER COLUMN "OrganizationID" DROP DEFAULT,
ALTER COLUMN "OrganizationID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Organization_pkey" PRIMARY KEY ("OrganizationID");
DROP SEQUENCE "Organization_OrganizationID_seq";

-- AlterTable
ALTER TABLE "Volunteer" ADD COLUMN     "IsOverEighteen" BOOLEAN;

-- AlterTable
ALTER TABLE "VolunteerEvent" DROP CONSTRAINT "VolunteerEvent_pkey",
ALTER COLUMN "ID" DROP DEFAULT,
ALTER COLUMN "ID" SET DATA TYPE TEXT,
ALTER COLUMN "EventID" SET DATA TYPE TEXT,
ADD CONSTRAINT "VolunteerEvent_pkey" PRIMARY KEY ("ID");
DROP SEQUENCE "VolunteerEvent_ID_seq";

-- CreateTable
CREATE TABLE "Representative" (
    "RepresentativeID" TEXT NOT NULL,
    "RepresentativeName" TEXT[],
    "RepresentativeEmail" TEXT[],
    "RepresentativePhone" TEXT[],
    "PositionInCompany" TEXT[],
    "OrganizationID" TEXT NOT NULL,

    CONSTRAINT "Representative_pkey" PRIMARY KEY ("RepresentativeID")
);

-- CreateTable
CREATE TABLE "_GrantToRepresentative" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GrantToRepresentative_AB_unique" ON "_GrantToRepresentative"("A", "B");

-- CreateIndex
CREATE INDEX "_GrantToRepresentative_B_index" ON "_GrantToRepresentative"("B");

-- AddForeignKey
ALTER TABLE "Representative" ADD CONSTRAINT "Representative_OrganizationID_fkey" FOREIGN KEY ("OrganizationID") REFERENCES "Organization"("OrganizationID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerEvent" ADD CONSTRAINT "VolunteerEvent_EventID_fkey" FOREIGN KEY ("EventID") REFERENCES "Event"("EventID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GrantToRepresentative" ADD CONSTRAINT "_GrantToRepresentative_A_fkey" FOREIGN KEY ("A") REFERENCES "Grant"("GrantID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GrantToRepresentative" ADD CONSTRAINT "_GrantToRepresentative_B_fkey" FOREIGN KEY ("B") REFERENCES "Representative"("RepresentativeID") ON DELETE CASCADE ON UPDATE CASCADE;
