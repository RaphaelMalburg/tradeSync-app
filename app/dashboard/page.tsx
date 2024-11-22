import { DashboardAIInsightDTO, DashboardTradeDTO } from "@/lib/dto/dashboard.dto";

import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { getPerformance } from "@/lib/actions/performace";

import { checkUser } from "@/lib/checkUser";
import { DashboardPerformanceDTO } from "@/lib/dto/dashboard.dto";
import { mapToDashboardDTO } from "@/lib/mappers/dashboardMapper";
import { getRecentTrades } from "@/lib/actions/trades";
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
export default async function TradingDashboard() {
  const user = await checkUser();
  const userId = user?.id ?? "";

  // Get trades and performance data
  const tradesRaw = await getRecentTrades(userId);
  const performance = await getPerformance(userId);

  const dashboardData = mapToDashboardDTO(performance, tradesRaw);

  return (
    <div className="flex h-screen w-full">
      <DashboardContent {...dashboardData} />
    </div>
  );
}
