-- AlterTable
ALTER TABLE "automations" ADD COLUMN     "actionOptionsId" INTEGER,
ADD COLUMN     "reactionOptionsId" INTEGER;

-- AddForeignKey
ALTER TABLE "automations" ADD CONSTRAINT "automations_actionOptionsId_fkey" FOREIGN KEY ("actionOptionsId") REFERENCES "ActionOptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automations" ADD CONSTRAINT "automations_reactionOptionsId_fkey" FOREIGN KEY ("reactionOptionsId") REFERENCES "ReactionOptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
