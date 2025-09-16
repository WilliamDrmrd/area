/*
  Warnings:

  - You are about to drop the column `url` on the `actions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `automations` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `reactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "automations" DROP CONSTRAINT "automations_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "automations" DROP CONSTRAINT "automations_userId_fkey";

-- AlterTable
ALTER TABLE "actions" DROP COLUMN "url";

-- AlterTable
ALTER TABLE "automations" DROP COLUMN "userId",
ADD COLUMN     "creatorID" INTEGER,
ALTER COLUMN "serviceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reactions" DROP COLUMN "url";

-- AddForeignKey
ALTER TABLE "automations" ADD CONSTRAINT "automations_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automations" ADD CONSTRAINT "automations_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
