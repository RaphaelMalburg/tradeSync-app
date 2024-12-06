import { checkUser } from "@/lib/checkUser";
import Insights from "@/components/features/dashboard/metrics/Insights";
import { redirect } from "next/navigation";
import { getAccounts } from "@/lib/actions/accounts";

export default async function InsightsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const user = await checkUser();
  const accounts = await getAccounts();
  const accountId = searchParams.accountId as string;

  if (!user) {
    redirect("/sign-in?redirect_url=/dashboard/insights");
  }

  if (!accountId && accounts.length > 0) {
    redirect(`/dashboard/insights?accountId=${accounts[0].id}`);
  }

  return <Insights userId={user.id} accountId={accountId} />;
}
