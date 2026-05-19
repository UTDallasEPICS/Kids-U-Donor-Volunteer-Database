/*
  Warnings:

  - You are about to drop the column `backgroundCheckRequired` on the `Event` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OrientationInviteStatus" AS ENUM ('DRAFT', 'SENT', 'CONFIRMED', 'EXPIRED');

-- AlterTable
-- ALTER TABLE "Event" DROP COLUMN "backgroundCheckRequired";

-- CreateTable
CREATE TABLE "VolunteerOrientationInvitation" (
    "id" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "meetingLink" TEXT NOT NULL,
    "status" "OrientationInviteStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstEmailSentAt" TIMESTAMP(3),
    "selectionDeadline" TIMESTAMP(3),
    "initialEmailSentByUserId" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "confirmedAdminUserId" TEXT,
    "selectedSlotId" TEXT,

    CONSTRAINT "VolunteerOrientationInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolunteerOrientationSlot" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "bookedAt" TIMESTAMP(3),
    "bookedByVolunteerId" TEXT,

    CONSTRAINT "VolunteerOrientationSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerOrientationInvitation_volunteerId_key" ON "VolunteerOrientationInvitation"("volunteerId");

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerOrientationInvitation_selectedSlotId_key" ON "VolunteerOrientationInvitation"("selectedSlotId");

-- CreateIndex
CREATE INDEX "VolunteerOrientationSlot_invitationId_startTime_idx" ON "VolunteerOrientationSlot"("invitationId", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerOrientationSlot_invitationId_startTime_adminUserId_key" ON "VolunteerOrientationSlot"("invitationId", "startTime", "adminUserId");

-- AddForeignKey
ALTER TABLE "VolunteerOrientationInvitation" ADD CONSTRAINT "VolunteerOrientationInvitation_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerOrientationInvitation" ADD CONSTRAINT "VolunteerOrientationInvitation_initialEmailSentByUserId_fkey" FOREIGN KEY ("initialEmailSentByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerOrientationInvitation" ADD CONSTRAINT "VolunteerOrientationInvitation_confirmedAdminUserId_fkey" FOREIGN KEY ("confirmedAdminUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerOrientationInvitation" ADD CONSTRAINT "VolunteerOrientationInvitation_selectedSlotId_fkey" FOREIGN KEY ("selectedSlotId") REFERENCES "VolunteerOrientationSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerOrientationSlot" ADD CONSTRAINT "VolunteerOrientationSlot_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "VolunteerOrientationInvitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerOrientationSlot" ADD CONSTRAINT "VolunteerOrientationSlot_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerOrientationSlot" ADD CONSTRAINT "VolunteerOrientationSlot_bookedByVolunteerId_fkey" FOREIGN KEY ("bookedByVolunteerId") REFERENCES "Volunteer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
