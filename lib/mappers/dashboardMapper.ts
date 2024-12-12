import { DashboardDTO, DashboardTradeDTO, DashboardPerformanceDTO } from "@/lib/dto/dashboard.dto";
import { Performance, Trade } from "@prisma/client";

function calculateDuration(entryTime: Date, exitTime: Date): number {
  const diff = exitTime.getTime() - entryTime.getTime();
  return Math.floor(diff / 1000 / 60);
}

export function mapTradeToDTO(trade: Trade): DashboardTradeDTO {
  return {
    id: trade.id,
    instrument: trade.instrument,
    entryPrice: trade.entryPrice,
    exitPrice: trade.exitPrice,
    profitLoss: trade.profitLoss,
    positionType: trade.positionType || "Buy",
    entryTime: trade.entryTime,
    exitTime: trade.exitTime,
    duration: calculateDuration(trade.entryTime, trade.exitTime),
    sentiment: trade.sentiment ?? "Neutral",
    strategyId: trade.strategyId || undefined,
    commission: trade.commission || 0,
    riskReward: trade.riskReward || undefined,
    setup: trade.setup || [],
    symbol: trade.symbol || undefined,
    timeframe: trade.timeframe || undefined,
  };
}

export function mapPerformanceToDTO(performance: Performance, trades: Trade[] = []): DashboardPerformanceDTO {
  const profitFactor = calculateProfitFactor(trades);

  return {
    id: performance.id,
    createdAt: performance.createdAt,
    winRate: performance.winRate,
    averageProfitLoss: performance.averageProfitLoss,
    maxDrawdown: performance.maxDrawdown,
    averageHoldingTime: performance.averageHoldingTime,
    profitFactor,
    trades: trades.map(mapTradeToDTO),
  };
}

function calculateProfitFactor(trades: Trade[]): number {
  const grossProfit = trades.filter((t) => t.profitLoss > 0).reduce((sum, t) => sum + t.profitLoss, 0);
  const grossLoss = Math.abs(trades.filter((t) => t.profitLoss < 0).reduce((sum, t) => sum + t.profitLoss, 0));
  return grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
}

export function mapToDashboardDTO(performance: Performance[], trades: Trade[]): DashboardDTO {
  return {
    performance: performance.map((p) => mapPerformanceToDTO(p, trades)),
    trades: trades.map(mapTradeToDTO),
    recentTrades: trades.slice(-5).map(mapTradeToDTO),
  };
}
