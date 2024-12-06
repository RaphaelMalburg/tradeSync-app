-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "commission" DOUBLE PRECISION,
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "riskReward" DOUBLE PRECISION,
ADD COLUMN     "setup" TEXT[],
ADD COLUMN     "side" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "symbol" TEXT,
ADD COLUMN     "timeframe" TEXT,
ADD COLUMN     "volume" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_sessionId_key" ON "Order"("sessionId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_email_idx" ON "Order"("email");
