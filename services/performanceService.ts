// services/performanceService.ts
import { PrismaClient } from "@prisma/client";
import { calculatePerformanceMetrics } from "@/lib/tradingCalculation";

const prisma = new PrismaClient();

export async function updateUserPerformanceMetrics(userId: string) {
  const trades = await prisma.trade.findMany({
    where: { userId },
    orderBy: { entryTime: "desc" },
    take: 100, // Consider last 100 trades for metrics
  });

  if (trades.length === 0) return;

  // Calculate metrics
  const metrics = calculatePerformanceMetrics(trades);

  // Create new performance record
  await prisma.performance.create({
    data: {
      userId,
      winRate: metrics.winRate,
      averageProfitLoss: metrics.avgProfitLoss,
      maxDrawdown: metrics.maxDrawdown,
      averageHoldingTime: metrics.avgHoldingTime,
    },
  });

  // Optional: Clean up old records (keep last 30 days)
  await prisma.performance.deleteMany({
    where: {
      userId,
      createdAt: {
        lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });
}
