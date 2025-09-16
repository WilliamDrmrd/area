/*
  Warnings:

  - You are about to drop the column `lastRun` on the `automations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "automations" DROP COLUMN "lastRun";

-- CreateTable
CREATE TABLE "AutomationHistory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uuid" TEXT NOT NULL,
    "runnedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutomationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AutomationHistory_uuid_key" ON "AutomationHistory"("uuid");
