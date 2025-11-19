/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `volunteerAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `volunteerAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "volunteerAccount" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "volunteerAccount_email_key" ON "volunteerAccount"("email");
