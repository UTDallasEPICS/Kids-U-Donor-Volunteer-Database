-- CreateTable
CREATE TABLE "volunteerAccount" (
    "id" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "volunteerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "volunteerAccount_volunteerId_key" ON "volunteerAccount"("volunteerId");

-- CreateIndex
CREATE UNIQUE INDEX "volunteerAccount_username_key" ON "volunteerAccount"("username");
