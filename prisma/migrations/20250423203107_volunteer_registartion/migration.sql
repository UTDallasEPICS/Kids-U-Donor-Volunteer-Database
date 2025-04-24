/*
  Warnings:

  - Added the required column `registration` to the `Volunteer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Volunteer" ADD COLUMN     "registration" BOOLEAN NOT NULL;
