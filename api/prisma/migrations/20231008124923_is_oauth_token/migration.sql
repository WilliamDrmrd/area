-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isOauth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "token" TEXT;
