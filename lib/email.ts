import { OrderConfirmationEmail } from "@/components/emails/OrderConfirmationEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

type OrderDetails = {
  id: string;
  items: { name: string; description: string; price: number; quantity: number }[];
  total: number;
};

export async function sendOrderConfirmation(email: string, orderDetails: OrderDetails) {
  try {
    //const emailHtml = renderToStaticMarkup(OrderConfirmationEmail({ orderDetails }));

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Order Confirmation",
      react: OrderConfirmationEmail({ orderDetails }),
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
