"use server";

import { db } from "@/lib/db";
import { Trade } from "@prisma/client";

export async function getTrades(userId: string): Promise<Trade[]> {
  if (!userId) {
    return [];
  }

  try {
    const trades = await db.trade.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        entryTime: "desc",
      },
      take: 100, // Limit to last 100 trades for performance
    });

    return trades;
  } catch (error) {
    console.error("Error fetching trades:", error);
    throw new Error("Failed to fetch trades");
  }
}

export async function getRecentTrades(userId: string): Promise<Trade[]> {
  if (!userId) {
    return [];
  }

  try {
    const trades = await db.trade.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        entryTime: "desc",
      },
      take: 5, // Get only the 5 most recent trades
    });

    return trades;
  } catch (error) {
    console.error("Error fetching recent trades:", error);
    throw new Error("Failed to fetch recent trades");
  }
}
