// services/performanceService.ts
import { PrismaClient } from "@prisma/client";
import { calculateWinRate, calculateAverageProfitLoss, calculateMaxDrawdown, calculateAverageHoldingTime } from "@/lib/tradingCalculation";

const prisma = new PrismaClient();

export async function updateUserPerformanceMetrics(userId: string) {
  // Fetch all trades for the user
  const trades = await prisma.trade.findMany({
    where: { userId },
  });

  if (trades.length === 0) return; // No trades to process

  // Calculate performance metrics
  const winRate = calculateWinRate(trades);
  const avgProfitLoss = calculateAverageProfitLoss(trades);
  const maxDrawdown = calculateMaxDrawdown(trades);
  const avgHoldingTime = calculateAverageHoldingTime(trades);

  // Update or create performance record in the database
  await prisma.performance.upsert({
    where: { id: userId },
    update: {
      winRate,
      averageProfitLoss: avgProfitLoss,
      maxDrawdown,
      averageHoldingTime: avgHoldingTime,
    },
    create: {
      userId,
      winRate,
      averageProfitLoss: avgProfitLoss,
      maxDrawdown,
      averageHoldingTime: avgHoldingTime,
    },
  });
}
