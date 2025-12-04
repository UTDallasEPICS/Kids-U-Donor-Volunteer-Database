-- AlterTable
ALTER TABLE "Volunteer" ADD COLUMN     "driversLicense" BOOLEAN,
ADD COLUMN     "referenceName" TEXT,
ADD COLUMN     "reliableTransport" BOOLEAN,
ADD COLUMN     "speakSpanish" BOOLEAN,
ALTER COLUMN "usCitizen" DROP NOT NULL;
