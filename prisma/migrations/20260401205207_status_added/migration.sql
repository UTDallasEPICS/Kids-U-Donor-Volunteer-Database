/*
  Warnings:

  - The values [NOT_SENT] on the enum `VolunteerAppStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `accepted` on the `VolunteerApplication` table. All the data in the column will be lost.
  - You are about to drop the column `hasBeenProcessed` on the `VolunteerApplication` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VolunteerAppStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "Volunteer" ALTER COLUMN "volunteerApplicationStatus" DROP DEFAULT;
ALTER TABLE "Volunteer" ALTER COLUMN "volunteerApplicationStatus" TYPE "VolunteerAppStatus_new" USING ("volunteerApplicationStatus"::text::"VolunteerAppStatus_new");
ALTER TYPE "VolunteerAppStatus" RENAME TO "VolunteerAppStatus_old";
ALTER TYPE "VolunteerAppStatus_new" RENAME TO "VolunteerAppStatus";
DROP TYPE "VolunteerAppStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Volunteer" ALTER COLUMN "volunteerApplicationStatus" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "VolunteerApplication" DROP COLUMN "accepted",
DROP COLUMN "hasBeenProcessed",
ADD COLUMN     "status" "VolunteerAppStatus" NOT NULL DEFAULT 'PENDING';
