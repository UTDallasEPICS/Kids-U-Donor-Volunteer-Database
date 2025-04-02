-- AlterTable
ALTER TABLE "Grantor" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;
