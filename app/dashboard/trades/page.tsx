import { checkUser } from "@/lib/checkUser";
import { getTrades } from "@/lib/actions/trades";
import { DashboardTradeDTO } from "@/lib/dto/dashboard.dto";
import Trades from "@/components/features/dashboard/trades/Trades";
import { getAccounts } from "@/lib/actions/accounts";
import { redirect } from "next/navigation";

export default async function TradesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const user = await checkUser();
  const accounts = await getAccounts();
  const accountId = searchParams.accountId as string;

  if (!accountId && accounts.length > 0) {
    redirect(`/dashboard/trades?accountId=${accounts[0].id}`);
  }

  const trades = (await getTrades(user?.id ?? "", accountId)) as DashboardTradeDTO[];

  return <Trades trades={trades} />;
}
