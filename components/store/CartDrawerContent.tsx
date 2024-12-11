"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { CartItem } from "./CartItem";
import { Input } from "../ui/input";
import { useUser } from "@clerk/nextjs";
import { ScrollArea } from "../ui/scroll-area";

export function CartDrawerContent() {
  const { items, total } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleCheckout = async () => {
    if (!user && !email) {
      setEmailError("Email is required for guest checkout");
      return;
    }

    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: items,
          email: user?.primaryEmailAddress?.emailAddress || email,
        }),
      });
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <ScrollArea className="flex-1 p-4">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div key="empty-cart" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">Your cart is empty</p>
            </motion.div>
          ) : (
            <motion.div key="cart-items" className="space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <CartItem item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {items.length > 0 && (
        <div className="border-t p-4 space-y-4">
          <div className="text-lg font-bold">Total: ${total.toFixed(2)}</div>
          {!user && (
            <div>
              <Input
                type="email"
                placeholder="Enter your email to checkout"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                className={emailError ? "border-red-500" : ""}
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>
          )}
          <Button className="w-full" disabled={isCheckingOut} onClick={handleCheckout}>
            {isCheckingOut ? "Processing..." : "Checkout"}
          </Button>
        </div>
      )}
    </div>
  );
}
