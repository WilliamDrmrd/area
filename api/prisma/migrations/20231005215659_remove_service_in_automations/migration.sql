/*
  Warnings:

  - You are about to drop the column `serviceId` on the `automations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "automations" DROP CONSTRAINT "automations_serviceId_fkey";

-- AlterTable
ALTER TABLE "automations" DROP COLUMN "serviceId";
