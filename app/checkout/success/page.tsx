import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { SuccessContent } from "@/components/store/SuccessContent";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const sessionId = typeof searchParams.session_id === "string" ? searchParams.session_id : undefined;

  if (!sessionId) {
    redirect("/");
    return null;
  }

  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (!stripeSession) {
    redirect("/");
    return null;
  }

  return <SuccessContent session={stripeSession} />;
}
