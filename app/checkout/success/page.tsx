import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { SuccessContent } from "@/components/store/SuccessContent";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id as string;

  if (!sessionId) {
    redirect("/");
  }

  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (!stripeSession) {
    redirect("/");
  }

  return <SuccessContent session={stripeSession} />;
}
