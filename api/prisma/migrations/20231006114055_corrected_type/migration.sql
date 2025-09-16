/*
  Warnings:

  - You are about to drop the column `asAdditionalFields` on the `actions` table. All the data in the column will be lost.
  - You are about to drop the column `asOptions` on the `actions` table. All the data in the column will be lost.
  - You are about to drop the column `asAdditionalFields` on the `reactions` table. All the data in the column will be lost.
  - You are about to drop the column `asOptions` on the `reactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "actions" DROP COLUMN "asAdditionalFields",
DROP COLUMN "asOptions",
ADD COLUMN     "hasAdditionalFields" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasOptions" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "reactions" DROP COLUMN "asAdditionalFields",
DROP COLUMN "asOptions",
ADD COLUMN     "hasAdditionalFields" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasOptions" BOOLEAN NOT NULL DEFAULT false;
