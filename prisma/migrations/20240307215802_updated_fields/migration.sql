/*
  Warnings:

  - You are about to drop the column `Address` on the `Constituent` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Constituent` table. All the data in the column will be lost.
  - Added the required column `City` to the `Constituent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Country` to the `Constituent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FirstName` to the `Constituent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LastName` to the `Constituent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `State` to the `Constituent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StreetAddress` to the `Constituent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Zipcode` to the `Constituent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Constituent" DROP COLUMN "Address",
DROP COLUMN "Name",
ADD COLUMN     "City" TEXT NOT NULL,
ADD COLUMN     "Country" TEXT NOT NULL,
ADD COLUMN     "FirstName" TEXT NOT NULL,
ADD COLUMN     "LastName" TEXT NOT NULL,
ADD COLUMN     "State" TEXT NOT NULL,
ADD COLUMN     "StreetAddress" TEXT NOT NULL,
ADD COLUMN     "Zipcode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Volunteer" ADD COLUMN     "BackgroundCheckCompletion" BOOLEAN;
