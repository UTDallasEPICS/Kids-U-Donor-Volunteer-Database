/*
  Warnings:

  - A unique constraint covering the columns `[personId]` on the table `Volunteer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
-- ALTER TABLE "Volunteer" ADD COLUMN     "personId" TEXT;

-- CreateIndex
--CREATE UNIQUE INDEX "Volunteer_personId_key" ON "Volunteer"("personId");

-- AddForeignKey
-- ALTER TABLE "Volunteer" ADD CONSTRAINT "Volunteer_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
