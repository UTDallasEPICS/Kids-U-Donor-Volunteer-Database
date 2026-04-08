/*
  Warnings:

  - You are about to drop the column `volunteerApplicationCompleted` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `volunteerApplicationStatus` on the `VolunteerApplication` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VolunteerAppStatus" AS ENUM ('NOT_SENT', 'PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Volunteer" DROP COLUMN "volunteerApplicationCompleted",
ADD COLUMN     "volunteerApplicationStatus" "VolunteerAppStatus" NOT NULL DEFAULT 'NOT_SENT';

-- AlterTable
ALTER TABLE "VolunteerApplication" DROP COLUMN "volunteerApplicationStatus",
ADD COLUMN     "hasBeenProcessed" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "VolunteerApplicationStatus";
