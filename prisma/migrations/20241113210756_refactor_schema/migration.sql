/*
  Warnings:

  - You are about to drop the column `segment` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `finalReportDueDate` on the `Grant` table. All the data in the column will be lost.
  - You are about to drop the column `isSiteVisitRequired` on the `Grant` table. All the data in the column will be lost.
  - You are about to drop the column `programAlignment` on the `Grant` table. All the data in the column will be lost.
  - You are about to drop the column `proposalReviewDate` on the `Grant` table. All the data in the column will be lost.
  - You are about to drop the column `remainingBalance` on the `Grant` table. All the data in the column will be lost.
  - You are about to drop the column `reportReviewDate` on the `Grant` table. All the data in the column will be lost.
  - You are about to drop the column `siteVisitDate` on the `Grant` table. All the data in the column will be lost.
  - You are about to drop the column `totalExpensesIncurred` on the `Grant` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Grantor` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the `GrantExpense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GrantPayment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[organizationId]` on the table `Grantor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `Grantor` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VOLUNTER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_grantorId_fkey";

-- DropForeignKey
ALTER TABLE "GrantExpense" DROP CONSTRAINT "GrantExpense_grantId_fkey";

-- DropForeignKey
ALTER TABLE "GrantPayment" DROP CONSTRAINT "GrantPayment_grantId_fkey";

-- DropIndex
DROP INDEX "Donation_donorId_key";

-- DropIndex
DROP INDEX "Grantor_name_key";

-- DropIndex
DROP INDEX "Organization_phoneNumber_key";

-- AlterTable
ALTER TABLE "Donor" DROP COLUMN "segment";

-- AlterTable
ALTER TABLE "Grant" DROP COLUMN "finalReportDueDate",
DROP COLUMN "isSiteVisitRequired",
DROP COLUMN "programAlignment",
DROP COLUMN "proposalReviewDate",
DROP COLUMN "remainingBalance",
DROP COLUMN "reportReviewDate",
DROP COLUMN "siteVisitDate",
DROP COLUMN "totalExpensesIncurred";

-- AlterTable
ALTER TABLE "Grantor" DROP COLUMN "name",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "phoneNumber",
ALTER COLUMN "emailAddress" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;

-- DropTable
DROP TABLE "GrantExpense";

-- DropTable
DROP TABLE "GrantPayment";

-- CreateIndex
CREATE UNIQUE INDEX "Grantor_organizationId_key" ON "Grantor"("organizationId");

-- AddForeignKey
ALTER TABLE "Grantor" ADD CONSTRAINT "Grantor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
