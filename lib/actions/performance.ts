"use server";
import { db } from "@/lib/db";
import { Trade } from "@prisma/client";

interface Metrics {
  winRate: number;
  averageProfitLoss: number;
  totalTrades: number;
  profitFactor?: number;
  averageHoldingTime: number;
  maxDrawdown?: number;
}

function calculateMetrics(trades: Trade[]): Metrics {
  if (!trades.length) {
    return {
      winRate: 0,
      averageProfitLoss: 0,
      totalTrades: 0,
      averageHoldingTime: 0,
    };
  }

  const winningTrades = trades.filter((trade) => trade.profitLoss > 0);
  const winRate = (winningTrades.length / trades.length) * 100;
  const averageProfitLoss = trades.reduce((acc, trade) => acc + trade.profitLoss, 0) / trades.length;

  const holdingTimes = trades.map((trade) => new Date(trade.exitTime).getTime() - new Date(trade.entryTime).getTime());
  const averageHoldingTime = holdingTimes.reduce((acc, time) => acc + time, 0) / trades.length;

  return {
    winRate,
    averageProfitLoss,
    totalTrades: trades.length,
    averageHoldingTime,
  };
}

export async function calculateAndStoreDailyPerformance(userId: string, accountId?: string) {
  const todayTrades = await db.trade.findMany({
    where: {
      userId,
      accountId,
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });

  const metrics = calculateMetrics(todayTrades);

  return await db.performance.create({
    data: {
      userId,
      accountId,
      winRate: metrics.winRate,
      averageProfitLoss: metrics.averageProfitLoss,
      averageHoldingTime: metrics.averageHoldingTime,
      maxDrawdown: 0,
      createdAt: new Date(),
    },
  });
}

export async function getAggregatedPerformance(userId: string, accountId?: string, days: number = 30) {
  return await db.performance.findMany({
    where: {
      userId,
      accountId,
      createdAt: {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCurrentDayPerformance(userId: string, accountId?: string) {
  const todayTrades = await db.trade.findMany({
    where: {
      userId,
      accountId,
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });

  return calculateMetrics(todayTrades);
}

export async function getPerformance(userId: string, accountId?: string) {
  return await db.performance.findMany({
    where: {
      userId,
      accountId,
    },
    include: {
      trades: true,
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
}
