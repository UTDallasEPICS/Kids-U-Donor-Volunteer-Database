/*
  Warnings:

  - You are about to drop the column `DueDate` on the `Grant` table. All the data in the column will be lost.
  - Added the required column `GrantDueDate` to the `Grant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Grant" DROP COLUMN "DueDate",
ADD COLUMN     "GrantDueDate" TIMESTAMP(3) NOT NULL;
