import { db } from "@/lib/db";
import { calculatePerformanceMetrics } from "../tradingCalculation";

export async function handleDailyPerformanceCalculation() {
  try {
    const users = await db.user.findMany({
      include: {
        Account: true,
      },
    });

    // Calculate performance for each user and their accounts
    for (const user of users) {
      // Fetch user's trades
      const userTrades = await db.trade.findMany({
        where: { userId: user.id },
      });

      // Calculate overall user performance
      await calculatePerformanceMetrics(userTrades);

      // Calculate per-account performance
      for (const account of user.Account) {
        const accountTrades = await db.trade.findMany({
          where: {
            userId: user.id,
            accountId: account.id,
          },
        });
        await calculatePerformanceMetrics(accountTrades);
      }
    }
  } catch (error) {
    console.error("Daily performance calculation failed:", error);
    // Implement your error logging here
  }
}
