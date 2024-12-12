import { db } from "@/lib/db";
import { calculatePerformanceMetrics } from "../tradingCalculation";
import type { Trade } from "@prisma/client";

function mapToTrade(dbTrade: Trade) {
  return {
    profitLoss: dbTrade.profitLoss,
    duration: dbTrade.duration,
    entryTime: dbTrade.entryTime,
    exitTime: dbTrade.exitTime,
    commission: dbTrade.commission || undefined,
  };
}

export async function handleDailyPerformanceCalculation() {
  try {
    const users = await db.user.findMany({
      include: {
        Account: true,
      },
    });

    for (const user of users) {
      const userTrades = await db.trade.findMany({
        where: { userId: user.id },
      });

      await calculatePerformanceMetrics(userTrades.map(mapToTrade));

      for (const account of user.Account) {
        const accountTrades = await db.trade.findMany({
          where: {
            userId: user.id,
            accountId: account.id,
          },
        });
        await calculatePerformanceMetrics(accountTrades.map(mapToTrade));
      }
    }
  } catch (error) {
    console.error("Daily performance calculation failed:", error);
  }
}
