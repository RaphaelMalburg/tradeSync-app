import { checkUser } from "@/lib/checkUser";
import Insights from "@/components/dashboard/Insights";
import { redirect } from "next/navigation";

export default async function InsightsPage() {
  const user = await checkUser();

  if (!user) {
    redirect("/sign-in?redirect_url=/dashboard/insights");
  }

  return <Insights userId={user.id} />;
}
