export interface DashboardTradeDTO {
  id: string;
  instrument: string;
  entryPrice: number;
  exitPrice: number;
  positionSize: number;
  profitLoss: number;
  entryTime: Date;
  exitTime: Date;
  duration: number;
  positionType: string;
  sentiment: string;
  screenshotUrl?: string;
}

export interface DashboardPerformanceDTO {
  id: string;
  winRate: number;
  averageHoldingTime: number;
  averageProfitLoss: number;
  maxDrawdown: number;
  createdAt: Date;
}

export interface DashboardAIInsightDTO {
  insightText: string;
  createdAt: Date;
}

export interface DashboardDTO {
  trades: DashboardTradeDTO[];
  performance: DashboardPerformanceDTO[];
  insights?: DashboardAIInsightDTO[];
}

export interface PerformanceDTO {
  id: string;
  createdAt: Date;
  winRate: number;
  averageProfitLoss: number;
  maxDrawdown: number;
  averageHoldingTime: number;
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

export interface DashboardDTO {
  performance: PerformanceDTO[];
  recentTrades: TradeDTO[];
}
