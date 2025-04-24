/*
  Warnings:

  - You are about to drop the column `additionalInfo1` on the `VolunteerApplication` table. All the data in the column will be lost.
  - You are about to drop the column `additionalInfo2` on the `VolunteerApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Volunteer" ADD COLUMN     "preferredRoles" TEXT[];

-- AlterTable
ALTER TABLE "VolunteerApplication" DROP COLUMN "additionalInfo1",
DROP COLUMN "additionalInfo2";
