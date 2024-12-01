"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cart";
import { CheckCircle } from "lucide-react";
import { Stripe } from "stripe";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface SuccessContentProps {
  session: Stripe.Checkout.Session;
}

export function SuccessContent({ session }: SuccessContentProps) {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 space-y-8">
      <div className="text-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold">Thank you for your purchase!</h1>
        <p className="text-gray-600 dark:text-gray-300">Order confirmation has been sent to {session.customer_details?.email}</p>
      </div>

      <div className="bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl rounded-xl border border-gray-200/20 dark:border-white/[0.08] p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {session.line_items?.data.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.description}</span>
              <span>
                {((item.amount_total || 0) / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>
          ))}
          <div className="border-t pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>
              {((session.amount_total || 0) / 100).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button onClick={() => router.push("/")}>Continue Shopping</Button>
      </div>
    </div>
  );
}
