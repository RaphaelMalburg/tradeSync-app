import { Sentiment } from "@prisma/client";

export interface DashboardTradeDTO {
  id: string;
  instrument: string;
  entryPrice: number;
  exitPrice: number;
  profitLoss: number;
  positionType: string;
  entryTime: Date;
  exitTime: Date;
  duration: number;
  sentiment: Sentiment;
  strategyId?: string;
  strategyName?: string;
  commission?: number;
  riskReward?: number;
  setup: string[];
  symbol?: string;
  timeframe?: string;
}

export interface DashboardPerformanceDTO {
  id: string;
  createdAt: Date;
  winRate: number;
  averageProfitLoss: number;
  maxDrawdown: number;
  averageHoldingTime: number;
  profitFactor: number;
  averageRisk?: number;
  averageReward?: number;
  trades: DashboardTradeDTO[];
}

export interface DashboardAIInsightDTO {
  insightText: string;
  createdAt: Date;
}

export interface DashboardDTO {
  trades: DashboardTradeDTO[];
  recentTrades: TradeDTO[];
  performance: DashboardPerformanceDTO[];
  insights?: DashboardAIInsightDTO[];
}

export interface TradeDTO {
  id: string;
  instrument: string;
  entryPrice: number;
  exitPrice: number;
  profitLoss: number;
  positionType: string;
  entryTime: Date;
  exitTime: Date;
}

export interface EnhancedTradeDTO {
  id: string;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  profitLoss: number;
  side: "LONG" | "SHORT";
  status: "WIN" | "LOSS";
  date: Date;
  setup: string[];
  riskReward?: number;
  volume: number;
  tags: string[];
  timeframe: string;
  strategy?: string;
}
