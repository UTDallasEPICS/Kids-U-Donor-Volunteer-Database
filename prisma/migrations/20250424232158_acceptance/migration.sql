-- AlterTable
ALTER TABLE "Volunteer" ADD COLUMN     "registration" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "VolunteerApplication" ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT false;
