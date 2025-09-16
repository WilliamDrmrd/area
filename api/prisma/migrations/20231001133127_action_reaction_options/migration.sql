-- CreateTable
CREATE TABLE "ActionOptions" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "actionId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "ActionOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReactionOptions" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "reactionId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "ReactionOptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActionOptions" ADD CONSTRAINT "ActionOptions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionOptions" ADD CONSTRAINT "ActionOptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionOptions" ADD CONSTRAINT "ReactionOptions_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "reactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionOptions" ADD CONSTRAINT "ReactionOptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
