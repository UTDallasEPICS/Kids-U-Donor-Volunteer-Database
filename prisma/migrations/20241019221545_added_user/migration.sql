/*
  Warnings:

  - Added the required column `fundingArea` to the `Grant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `GrantExpense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Grant" ADD COLUMN     "fundingArea" TEXT NOT NULL,
ALTER COLUMN "internalProposalDueDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GrantExpense" ADD COLUMN     "description" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "personId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrantPayment" (
    "id" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrantPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrantPurpose" (
    "id" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,

    CONSTRAINT "GrantPurpose_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_personId_key" ON "User"("personId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantPurpose" ADD CONSTRAINT "GrantPurpose_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "Grant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
