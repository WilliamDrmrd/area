-- CreateTable
CREATE TABLE "_AutomationToService" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AutomationToService_AB_unique" ON "_AutomationToService"("A", "B");

-- CreateIndex
CREATE INDEX "_AutomationToService_B_index" ON "_AutomationToService"("B");

-- AddForeignKey
ALTER TABLE "_AutomationToService" ADD CONSTRAINT "_AutomationToService_A_fkey" FOREIGN KEY ("A") REFERENCES "automations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AutomationToService" ADD CONSTRAINT "_AutomationToService_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
