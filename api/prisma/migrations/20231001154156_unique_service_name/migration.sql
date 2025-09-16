/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `services` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `services` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "services" DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "services"("name");
