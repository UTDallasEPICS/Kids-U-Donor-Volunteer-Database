/*
  Warnings:

  - You are about to drop the column `GrantDueDate` on the `Grant` table. All the data in the column will be lost.
  - The primary key for the `Representative` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `RepresentativeEmail` on the `Representative` table. All the data in the column will be lost.
  - You are about to drop the column `RepresentativeFirstName` on the `Representative` table. All the data in the column will be lost.
  - You are about to drop the column `RepresentativeID` on the `Representative` table. All the data in the column will be lost.
  - You are about to drop the column `RepresentativeLastName` on the `Representative` table. All the data in the column will be lost.
  - You are about to drop the column `RepresentativePhone` on the `Representative` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Email]` on the table `Representative` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Phone]` on the table `Representative` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `DueDate` to the `Grant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Email` to the `Representative` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FirstName` to the `Representative` table without a default value. This is not possible if the table is not empty.
  - The required column `ID` was added to the `Representative` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `LastName` to the `Representative` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_GrantToRepresentative" DROP CONSTRAINT "_GrantToRepresentative_B_fkey";

-- DropIndex
DROP INDEX "Representative_RepresentativeEmail_key";

-- DropIndex
DROP INDEX "Representative_RepresentativePhone_key";

-- AlterTable
ALTER TABLE "Grant" DROP COLUMN "GrantDueDate",
ADD COLUMN     "DueDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Representative" DROP CONSTRAINT "Representative_pkey",
DROP COLUMN "RepresentativeEmail",
DROP COLUMN "RepresentativeFirstName",
DROP COLUMN "RepresentativeID",
DROP COLUMN "RepresentativeLastName",
DROP COLUMN "RepresentativePhone",
ADD COLUMN     "Email" TEXT NOT NULL,
ADD COLUMN     "FirstName" TEXT NOT NULL,
ADD COLUMN     "ID" TEXT NOT NULL,
ADD COLUMN     "LastName" TEXT NOT NULL,
ADD COLUMN     "Phone" TEXT,
ADD CONSTRAINT "Representative_pkey" PRIMARY KEY ("ID");

-- CreateIndex
CREATE UNIQUE INDEX "Representative_Email_key" ON "Representative"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Representative_Phone_key" ON "Representative"("Phone");

-- AddForeignKey
ALTER TABLE "_GrantToRepresentative" ADD CONSTRAINT "_GrantToRepresentative_B_fkey" FOREIGN KEY ("B") REFERENCES "Representative"("ID") ON DELETE CASCADE ON UPDATE CASCADE;
