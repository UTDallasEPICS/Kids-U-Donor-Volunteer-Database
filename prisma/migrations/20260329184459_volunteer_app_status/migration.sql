/*
  Warnings:

  - The `volunteerApplicationCompleted` column on the `Volunteer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "VolunteerApplicationStatus" AS ENUM ('NOT_SENT', 'PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Volunteer" DROP COLUMN "volunteerApplicationCompleted",
ADD COLUMN     "volunteerApplicationCompleted" "VolunteerApplicationStatus" NOT NULL DEFAULT 'NOT_SENT';
