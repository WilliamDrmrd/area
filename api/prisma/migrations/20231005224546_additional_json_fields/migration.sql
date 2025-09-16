-- AlterTable
ALTER TABLE "actions" ADD COLUMN     "additionalFields" JSONB DEFAULT '{}',
ADD COLUMN     "asAdditionalFields" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "asOptions" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "reactions" ADD COLUMN     "additionalFields" JSONB DEFAULT '{}',
ADD COLUMN     "asAdditionalFields" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "asOptions" BOOLEAN NOT NULL DEFAULT false;
