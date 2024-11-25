import { checkUser } from "@/lib/checkUser";
import { getTrades } from "@/lib/actions/trades";
import Trades from "@/components/dashboard/Trades";
import { DashboardTradeDTO } from "@/lib/dto/dashboard.dto";

export default async function TradesPage() {
  const user = await checkUser();
  const trades = (await getTrades(user?.id ?? "")) as DashboardTradeDTO[];

  return <Trades trades={trades} />;
}
