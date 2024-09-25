/*
  Warnings:

  - The primary key for the `Donation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AmountDonated` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `DateReceived` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `DonationID` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `DonorID` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `DueDate` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `FundingAreas` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `KidsUPrograms` on the `Donation` table. All the data in the column will be lost.
  - The primary key for the `Donor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ConstituentID` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `ContactPreference` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `DonorID` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `NotesResources` on the `Donor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[donorId]` on the table `Donation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `campaign` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donorId` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fund` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Donation` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `type` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Donor` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Donor` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `Donor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Donor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Donor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Check', 'Card', 'Online', 'Venmo');

-- CreateEnum
CREATE TYPE "DonorType" AS ENUM ('Individual', 'Corporate');

-- CreateEnum
CREATE TYPE "DonationType" AS ENUM ('Item', 'Amount');

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_DonorID_fkey";

-- DropForeignKey
ALTER TABLE "Donor" DROP CONSTRAINT "Donor_ConstituentID_fkey";

-- AlterTable
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_pkey",
DROP COLUMN "AmountDonated",
DROP COLUMN "DateReceived",
DROP COLUMN "DonationID",
DROP COLUMN "DonorID",
DROP COLUMN "DueDate",
DROP COLUMN "FundingAreas",
DROP COLUMN "KidsUPrograms",
ADD COLUMN     "amount" DOUBLE PRECISION,
ADD COLUMN     "campaign" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "donorId" TEXT NOT NULL,
ADD COLUMN     "fund" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "item" TEXT,
ADD COLUMN     "itemValue" DOUBLE PRECISION,
ADD COLUMN     "paymentMethod" "PaymentMethod",
ADD COLUMN     "type" "DonationType" NOT NULL,
ADD CONSTRAINT "Donation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Donor" DROP CONSTRAINT "Donor_pkey",
DROP COLUMN "ConstituentID",
DROP COLUMN "ContactPreference",
DROP COLUMN "DonorID",
DROP COLUMN "NotesResources",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "type" "DonorType" NOT NULL,
ADD CONSTRAINT "Donor_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_donorId_key" ON "Address"("donorId");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_donorId_key" ON "Donation"("donorId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
