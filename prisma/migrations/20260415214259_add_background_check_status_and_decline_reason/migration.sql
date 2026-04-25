-- CreateEnum
CREATE TYPE "BackgroundCheckStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

-- AlterTable
ALTER TABLE "VolunteerBackgroundCheck" ADD COLUMN     "declineReason" TEXT,
ADD COLUMN     "status" "BackgroundCheckStatus" NOT NULL DEFAULT 'PENDING';
