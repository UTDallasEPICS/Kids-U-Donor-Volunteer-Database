/*
  Warnings:

  - You are about to drop the column `backgroundCheckRequired` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `approved` on the `VolunteerBackgroundCheck` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BGCheckStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "backgroundCheckRequired";

-- AlterTable
ALTER TABLE "VolunteerBackgroundCheck" DROP COLUMN "approved",
ADD COLUMN     "status" "BGCheckStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "SentEmail" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "volunteerId" TEXT NOT NULL,

    CONSTRAINT "SentEmail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SentEmail" ADD CONSTRAINT "SentEmail_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
