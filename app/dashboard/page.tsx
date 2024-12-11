import { DashboardAIInsightDTO, DashboardTradeDTO } from "@/lib/dto/dashboard.dto";

import { checkUser } from "@/lib/checkUser";
import { DashboardPerformanceDTO } from "@/lib/dto/dashboard.dto";
import { mapToDashboardDTO } from "@/lib/mappers/dashboardMapper";
import { getRecentTrades } from "@/lib/actions/trades";
import { getAccounts } from "@/lib/actions/accounts";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/features/dashboard/layout/DashboardContent";
import { getAggregatedPerformance } from "@/lib/actions/performance";

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
  performance: DashboardPerformanceDTO[];
  recentTrades: DashboardTradeDTO[];
}

export default async function TradingDashboard({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Convert searchParams to a regular object first
  const params = Object.fromEntries(Object.entries(await searchParams));

  const accountId = params.accountId;

  const user = await checkUser();
  const userId = user?.id ?? "";

  // Get accounts and handle account selection
  const accounts = await getAccounts();

  if (!accountId && accounts.length > 0) {
    redirect(`/dashboard?accountId=${accounts[0].id}`);
  }

  // Convert accountId to string or undefined
  const accountIdString = Array.isArray(accountId) ? accountId[0] : accountId;

  // Get trades and performance data for selected account
  const tradesRaw = await getRecentTrades(userId, accountIdString);
  const performance = await getAggregatedPerformance(userId, accountIdString, 30);

  console.log("performance ", performance);

  console.log("tradesRaw ", tradesRaw);
  const dashboardData = mapToDashboardDTO(performance, tradesRaw);

  return (
    <div className="flex h-screen w-full">
      <DashboardContent {...dashboardData} />
    </div>
  );
}
