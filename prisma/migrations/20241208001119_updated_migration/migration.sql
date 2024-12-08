/*
  Warnings:

  - The values [VOLUNTER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `grantorId` on the `Address` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('VOLUNTEER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropIndex
DROP INDEX "Address_grantorId_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "grantorId";

-- AlterTable
ALTER TABLE "Grant" ALTER COLUMN "awardNotificationDate" DROP NOT NULL,
ALTER COLUMN "proposalSubmissionDate" DROP NOT NULL,
ALTER COLUMN "renewalApplicationDate" DROP NOT NULL,
ALTER COLUMN "renewalAwardStatus" DROP NOT NULL;
