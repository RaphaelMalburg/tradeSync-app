import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { SuccessContent } from "@/components/store/SuccessContent";

export default async function SuccessPage({ searchParams }: { searchParams: { session_id: string } }) {
  if (!searchParams.session_id) {
    redirect("/");
  }

  const stripeSession = await stripe.checkout.sessions.retrieve(searchParams.session_id, {
    expand: ["line_items"],
  });

  if (!stripeSession) {
    redirect("/");
  }

  return <SuccessContent session={stripeSession} />;
}
