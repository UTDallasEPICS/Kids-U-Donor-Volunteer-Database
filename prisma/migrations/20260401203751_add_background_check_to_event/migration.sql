-- DropIndex
DROP INDEX "Volunteer_emailAddress_idx";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "backgroundCheckRequired" BOOLEAN NOT NULL DEFAULT false;
