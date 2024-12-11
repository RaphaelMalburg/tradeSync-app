import { db } from "@/lib/db";
import { calculateAndStoreDailyPerformance } from "@/lib/actions/performance";
import { User, Account } from "@prisma/client";

export async function handleDailyPerformanceCalculation() {
  try {
    const users = await db.user.findMany({
      include: {
        Account: true,
      },
    });

    // Calculate performance for each user and their accounts
    for (const user of users) {
      // Calculate overall user performance
      await calculateAndStoreDailyPerformance(user.id);

      // Calculate per-account performance
      for (const account of user.Account) {
        await calculateAndStoreDailyPerformance(user.id, account.id);
      }
    }
  } catch (error) {
    console.error("Daily performance calculation failed:", error);
    // Implement your error logging here
  }
}
