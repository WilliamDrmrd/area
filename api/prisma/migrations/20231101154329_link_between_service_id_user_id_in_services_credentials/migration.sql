/*
  Warnings:

  - A unique constraint covering the columns `[serviceId,userId]` on the table `ServicesCredentials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ServicesCredentials_serviceId_userId_key" ON "ServicesCredentials"("serviceId", "userId");
