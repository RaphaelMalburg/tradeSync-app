import { DashboardDTO, DashboardTradeDTO, PerformanceDTO } from "@/lib/dto/dashboard.dto";
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
    positionSize: trade.positionSize,
    duration: calculateDuration(trade.entryTime, trade.exitTime),
    sentiment: trade.sentiment ?? "",
  };
}

export function mapPerformanceToDTO(performance: Performance): PerformanceDTO {
  return {
    id: performance.id,
    createdAt: performance.createdAt,
    winRate: performance.winRate,
    averageProfitLoss: performance.averageProfitLoss,
    maxDrawdown: performance.maxDrawdown,
    averageHoldingTime: performance.averageHoldingTime,
  };
}

export function mapToDashboardDTO(performance: Performance[], trades: Trade[]): DashboardDTO {
  return {
    performance: performance.map(mapPerformanceToDTO),
    trades: trades.map(mapTradeToDTO),
    recentTrades: trades.slice(-5).map(mapTradeToDTO),
  };
}
