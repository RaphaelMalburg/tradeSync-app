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

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function getPageData(userId: string, accountId?: string) {
  const [accounts, trades, performance] = await Promise.all([
    getAccounts(),
    accountId ? getRecentTrades(userId, accountId) : Promise.resolve([]),
    accountId ? getAggregatedPerformance(userId, accountId, 30) : Promise.resolve([]),
  ]);

  return { accounts, trades, performance };
}

export default async function TradingDashboard({ searchParams }: { searchParams: SearchParams }) {
  const params = Object.fromEntries(Object.entries(await searchParams));
  const accountId = params.accountId;

  const user = await checkUser();
  const userId = user?.id ?? "";

  const { accounts, trades, performance } = await getPageData(userId, Array.isArray(accountId) ? accountId[0] : accountId);

  if (!accountId && accounts.length > 0) {
    redirect(`/dashboard?accountId=${accounts[0].id}`);
  }

  const dashboardData = mapToDashboardDTO(performance, trades);

  return (
    <div className="flex h-screen w-full">
      <DashboardContent {...dashboardData} />
    </div>
  );
}
