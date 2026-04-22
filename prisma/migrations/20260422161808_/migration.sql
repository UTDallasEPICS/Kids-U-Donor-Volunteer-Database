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
