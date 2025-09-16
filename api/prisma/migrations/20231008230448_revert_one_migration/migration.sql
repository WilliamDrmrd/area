/*
  Warnings:

  - You are about to drop the column `actionOptionsId` on the `automations` table. All the data in the column will be lost.
  - You are about to drop the column `reactionOptionsId` on the `automations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "automations" DROP CONSTRAINT "automations_actionOptionsId_fkey";

-- DropForeignKey
ALTER TABLE "automations" DROP CONSTRAINT "automations_reactionOptionsId_fkey";

-- AlterTable
ALTER TABLE "ActionOptions" ADD COLUMN     "automationId" INTEGER;

-- AlterTable
ALTER TABLE "ReactionOptions" ADD COLUMN     "automationId" INTEGER;

-- AlterTable
ALTER TABLE "automations" DROP COLUMN "actionOptionsId",
DROP COLUMN "reactionOptionsId";

-- AddForeignKey
ALTER TABLE "ActionOptions" ADD CONSTRAINT "ActionOptions_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "automations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionOptions" ADD CONSTRAINT "ReactionOptions_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "automations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
