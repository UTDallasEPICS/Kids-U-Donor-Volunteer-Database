-- DropForeignKey
ALTER TABLE "Donor" DROP CONSTRAINT "Donor_personId_fkey";

-- AlterTable
ALTER TABLE "Donor" ALTER COLUMN "personId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
