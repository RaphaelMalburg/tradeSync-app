import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

import { sendOrderConfirmation } from "@/lib/email";
import { createOrder } from "@/lib/db/orders";
import { currentUser } from "@clerk/nextjs/server";

// Define a type for cart items
type CartItem = {
  name: string;
  description: string;
  price: number;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cartItems, email } = body;

    // Get current user if logged in
    const user = await currentUser();

    // Create line items for Stripe
    const lineItems = cartItems.map((item: CartItem) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: item.price * 100, // Stripe expects amounts in cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      customer_email: user?.emailAddresses[0].emailAddress || email, // Use logged-in user's email or guest email
      metadata: {
        userId: user?.id || "guest",
        orderDetails: JSON.stringify(cartItems),
      },
    });

    // After successful Stripe session creation:
    const order = await createOrder({
      userId: user?.id || "guest",
      sessionId: stripeSession.id,
      items: cartItems,
      total: stripeSession.amount_total! / 100,
      email: user?.emailAddresses[0].emailAddress || email,
    });

    // Send confirmation email
    await sendOrderConfirmation(user?.emailAddresses[0].emailAddress || email, {
      id: order.id,
      items: cartItems,
      total: stripeSession.amount_total! / 100,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
