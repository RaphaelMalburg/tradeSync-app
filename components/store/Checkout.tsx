"use client";

import { Button } from "../ui/button";
import { useCartStore } from "@/lib/store/cart";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export function Checkout() {
  const { items } = useCartStore();
  const { user } = useUser();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: items,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });
      const { url } = await response.json();
      console.log("Checkout URL:", url);
      console.log("User email:", user?.primaryEmailAddress?.emailAddress);
      if (url) window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Button className="w-full" disabled={isCheckingOut} onClick={handleCheckout}>
      {isCheckingOut ? "Processing..." : "Checkout"}
    </Button>
  );
}
