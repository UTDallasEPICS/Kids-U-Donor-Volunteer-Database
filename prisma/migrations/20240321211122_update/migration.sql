/*
  Warnings:

  - You are about to drop the column `OrganizationID` on the `Grant` table. All the data in the column will be lost.
  - You are about to drop the column `ConstituentID` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `PositionInCompany` on the `Organization` table. All the data in the column will be lost.
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

-- AlterTable
ALTER TABLE "Constituent" ADD COLUMN     "AreaCode" TEXT;

-- AlterTable
ALTER TABLE "Grant" DROP COLUMN "OrganizationID";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "ConstituentID",
DROP COLUMN "PositionInCompany",
ADD COLUMN     "City" TEXT NOT NULL,
ADD COLUMN     "CompanySchoolName" TEXT,
ADD COLUMN     "Country" TEXT NOT NULL,
ADD COLUMN     "State" TEXT NOT NULL,
ADD COLUMN     "StreetAddress" TEXT NOT NULL,
ADD COLUMN     "Zipcode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Volunteer" ADD COLUMN     "IsOverEighteen" BOOLEAN;

-- CreateTable
CREATE TABLE "Representative" (
    "RepresentativeID" SERIAL NOT NULL,
    "RepresentativeName" TEXT[],
    "RepresentativeEmail" TEXT[],
    "RepresentativePhone" TEXT[],
    "PositionInCompany" TEXT[],
    "OrganizationID" INTEGER NOT NULL,

    CONSTRAINT "Representative_pkey" PRIMARY KEY ("RepresentativeID")
);

-- CreateTable
CREATE TABLE "_GrantToRepresentative" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GrantToRepresentative_AB_unique" ON "_GrantToRepresentative"("A", "B");

-- CreateIndex
CREATE INDEX "_GrantToRepresentative_B_index" ON "_GrantToRepresentative"("B");

-- AddForeignKey
ALTER TABLE "Representative" ADD CONSTRAINT "Representative_OrganizationID_fkey" FOREIGN KEY ("OrganizationID") REFERENCES "Organization"("OrganizationID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GrantToRepresentative" ADD CONSTRAINT "_GrantToRepresentative_A_fkey" FOREIGN KEY ("A") REFERENCES "Grant"("GrantID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GrantToRepresentative" ADD CONSTRAINT "_GrantToRepresentative_B_fkey" FOREIGN KEY ("B") REFERENCES "Representative"("RepresentativeID") ON DELETE CASCADE ON UPDATE CASCADE;
