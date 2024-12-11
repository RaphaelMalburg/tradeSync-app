/* eslint-disable @typescript-eslint/no-unused-vars */
import { checkUser } from "@/lib/checkUser";
import Insights from "@/components/features/dashboard/metrics/Insights";
import { redirect } from "next/navigation";
import { getAccounts } from "@/lib/actions/accounts";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface PageProps {
  searchParams: SearchParams;
  params: Promise<Record<string, string>>;
}

export default async function InsightsPage({ searchParams, params }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const user = await checkUser();
  const accounts = await getAccounts();
  const accountId = resolvedSearchParams.accountId as string;

  if (!user) {
    redirect("/sign-in?redirect_url=/dashboard/insights");
  }

  if (!accountId && accounts.length > 0) {
    redirect(`/dashboard/insights?accountId=${accounts[0].id}`);
  }

  return <Insights userId={user.id} accountId={accountId} />;
}
