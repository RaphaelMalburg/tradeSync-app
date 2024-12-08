import Trades from "@/components/features/dashboard/trades/Trades";
import { getPagedTrades, getTradeStatistics } from "@/lib/actions/trades";

const INITIAL_TRADES_COUNT = 20;

export default async function TradesPage() {
  const [initialTrades, initialStatistics] = await Promise.all([getPagedTrades(1, INITIAL_TRADES_COUNT), getTradeStatistics()]);

  return <Trades initialTrades={initialTrades} initialStatistics={initialStatistics} />;
}
