-- CreateTable
CREATE TABLE "_UserSubscriptions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserSubscriptions_AB_unique" ON "_UserSubscriptions"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSubscriptions_B_index" ON "_UserSubscriptions"("B");

-- AddForeignKey
ALTER TABLE "_UserSubscriptions" ADD CONSTRAINT "_UserSubscriptions_A_fkey" FOREIGN KEY ("A") REFERENCES "automations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSubscriptions" ADD CONSTRAINT "_UserSubscriptions_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
