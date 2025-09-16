/*
  Warnings:

  - You are about to drop the column `hasAdditionalFields` on the `actions` table. All the data in the column will be lost.
  - You are about to drop the column `hasAdditionalFields` on the `reactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "actions" DROP COLUMN "hasAdditionalFields";

-- AlterTable
ALTER TABLE "reactions" DROP COLUMN "hasAdditionalFields";
