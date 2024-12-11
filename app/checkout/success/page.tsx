import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { SuccessContent } from "@/components/store/SuccessContent";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface PageProps {
  searchParams: SearchParams;
}

export default async function SuccessPage(props: PageProps) {
  const searchParams = await props.searchParams;
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
