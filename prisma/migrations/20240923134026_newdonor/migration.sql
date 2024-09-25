/*
  Warnings:

  - The `paymentMethod` column on the `Donation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Donation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Donor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Donor" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "DonationType";

-- DropEnum
DROP TYPE "DonorType";

-- DropEnum
DROP TYPE "PaymentMethod";
