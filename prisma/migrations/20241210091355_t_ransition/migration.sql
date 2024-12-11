-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "performanceId" TEXT;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_performanceId_fkey" FOREIGN KEY ("performanceId") REFERENCES "Performance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
