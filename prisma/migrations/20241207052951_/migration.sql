-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_personId_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "personId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "_GrantToRepresentative" ADD CONSTRAINT "_GrantToRepresentative_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_GrantToRepresentative_AB_unique";

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
