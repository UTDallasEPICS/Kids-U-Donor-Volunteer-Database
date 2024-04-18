/*
  Warnings:

  - Added the required column `AwardStatus` to the `Grant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Grant" ADD COLUMN     "AwardStatus" TEXT NOT NULL;
