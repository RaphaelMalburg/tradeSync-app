import { checkUser } from "@/lib/checkUser";
import Analytics from "./Analytics";
import { redirect } from "next/navigation";

export default async function AnalyticsContainer() {
  const userData = await checkUser();

  if (!userData) {
    redirect("/sign-in");
  }

  return <Analytics userData={userData} />;
}
