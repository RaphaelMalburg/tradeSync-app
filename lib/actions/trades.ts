"use server";

import { db } from "@/lib/db";
import { DashboardTradeDTO } from "@/lib/dto/dashboard.dto";
import { Sentiment } from "@prisma/client";

import { revalidatePath } from "next/cache";

export async function updateTradeStrategy(tradeId: string, strategyId: string) {
  try {
    await db.trade.update({
      where: { id: tradeId },
      data: {
        strategyId: strategyId === "none" ? null : strategyId,
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error updating trade strategy:", error);
    throw new Error("Failed to update trade strategy");
  }
}

export async function getTrades(userId: string, accountId?: string): Promise<DashboardTradeDTO[]> {
  if (!userId) {
    return [];
  }

  try {
    const trades = await db.trade.findMany({
      where: {
        userId: userId,
        accountId: accountId,
      },
      include: {
        strategy: true,
      },
      orderBy: {
        entryTime: "desc",
      },
      take: 100, // Limit to last 100 trades for performance
    });

    return trades.map((trade) => ({
      id: trade.id,
      instrument: trade.instrument,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice,
      profitLoss: trade.profitLoss,
      positionType: trade.positionType || "Buy",
      entryTime: trade.entryTime,
      exitTime: trade.exitTime,
      duration: trade.duration,
      sentiment: trade.sentiment,
      strategyId: trade.strategyId || undefined,
      strategyName: trade.strategy?.name,
      commission: trade.commission || undefined,
      riskReward: trade.riskReward || undefined,
      setup: trade.setup,
      symbol: trade.symbol || undefined,
      timeframe: trade.timeframe || undefined,
    }));
  } catch (error) {
    console.error("Error fetching trades:", error);
    throw new Error("Failed to fetch trades");
  }
}

export async function getRecentTrades(userId: string, accountId?: string) {
  if (!userId) return [];

  try {
    const trades = await db.trade.findMany({
      where: {
        userId,
        ...(accountId ? { accountId } : {}),
      },
      orderBy: { entryTime: "desc" },
      take: 5,
      // Update select to include all required fields
      select: {
        id: true,
        tradeId: true,
        symbol: true,
        instrument: true,
        entryPrice: true,
        exitPrice: true,
        positionSize: true,
        profitLoss: true,
        entryTime: true,
        exitTime: true,
        performanceId: true,
        // Include other required fields...
      },
    });

    return trades;
  } catch (error) {
    console.error("Error fetching recent trades:", error);
    throw new Error("Failed to fetch recent trades");
  }
}

export async function updateTradeSentiment(tradeId: string, sentiment: Sentiment) {
  try {
    await db.trade.update({
      where: { id: tradeId },
      data: { sentiment },
    });
  } catch (error) {
    console.error("Error updating trade sentiment:", error);
    throw new Error("Failed to update trade sentiment");
  }
}

export async function updateStrategy(id: string, name: string, description?: string) {
  try {
    await db.strategy.update({
      where: { id },
      data: {
        name,
        description,
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error updating strategy:", error);
    throw new Error("Failed to update strategy");
  }
}

export async function getPagedTrades(page: number, limit: number): Promise<DashboardTradeDTO[]> {
  const skip = (page - 1) * limit;

  try {
    const trades = await db.trade.findMany({
      skip,
      take: limit,
      orderBy: {
        entryTime: "desc",
      },
      include: {
        strategy: true,
      },
    });

    return trades as DashboardTradeDTO[];
  } catch (error) {
    console.error("Error fetching trades:", error);
    throw new Error("Failed to fetch trades");
  }
}

export interface TradeStatistics {
  winRate: number;
  totalProfitLoss: number;
  averageProfitLoss: number;
  totalTrades: number;
  profitFactor: number;
}

export async function getTradeStatistics(): Promise<TradeStatistics> {
  try {
    // Get all trades for statistics
    const trades = await db.trade.findMany({
      select: {
        profitLoss: true,
      },
    });

    const totalTrades = trades.length;
    if (totalTrades === 0) {
      return {
        winRate: 0,
        totalProfitLoss: 0,
        averageProfitLoss: 0,
        totalTrades: 0,
        profitFactor: 0,
      };
    }

    const winningTrades = trades.filter((t) => t.profitLoss > 0);
    const totalProfitLoss = trades.reduce((sum, trade) => sum + trade.profitLoss, 0);

    // Calculate profit factor (total gains divided by total losses)
    const losingTrades = trades.filter((trade) => trade.profitLoss < 0);

    const totalGains = winningTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.profitLoss, 0));

    const profitFactor = totalLosses === 0 ? totalGains : totalGains / totalLosses;

    return {
      winRate: (winningTrades.length / totalTrades) * 100,
      totalProfitLoss,
      averageProfitLoss: totalProfitLoss / totalTrades,
      totalTrades,
      profitFactor: Number(profitFactor.toFixed(2)),
    };
  } catch (error) {
    console.error("Error calculating trade statistics:", error);
    throw new Error("Failed to calculate trade statistics");
  }
}
