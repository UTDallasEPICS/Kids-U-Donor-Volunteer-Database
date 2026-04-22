/*
  Warnings:

  - You are about to drop the column `backgroundCheckRequired` on the `Event` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `VolunteerBackgroundCheck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "backgroundCheckRequired";

-- AlterTable
ALTER TABLE "VolunteerBackgroundCheck" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
