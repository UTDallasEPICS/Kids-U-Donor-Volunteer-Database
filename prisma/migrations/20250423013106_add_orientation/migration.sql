-- CreateTable
CREATE TABLE "Orientation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "Orientation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Orientation" ADD CONSTRAINT "Orientation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
