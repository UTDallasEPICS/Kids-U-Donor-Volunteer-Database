/*
  Warnings:

  - You are about to drop the column `avatarData` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `avatarMimeType` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarData",
DROP COLUMN "avatarMimeType",
ADD COLUMN     "avatarPath" TEXT;
