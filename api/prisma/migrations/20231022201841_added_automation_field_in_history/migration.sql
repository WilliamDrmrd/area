/*
  Warnings:

  - Added the required column `automationId` to the `AutomationHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AutomationHistory" ADD COLUMN     "automationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "AutomationHistory" ADD CONSTRAINT "AutomationHistory_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "automations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
