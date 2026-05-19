-- AlterTable
ALTER TABLE "Donor" ADD COLUMN     "isCorporateSponsor" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "pointOfContactName" TEXT,
ADD COLUMN     "pointOfContactTitle" TEXT,
ADD COLUMN     "referralSource" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "referralSource" TEXT;
