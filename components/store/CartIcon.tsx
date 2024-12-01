"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CartIconProps {
  onOpen: () => void;
}

export function CartIcon({ onOpen }: CartIconProps) {
  const itemCount = useCartStore((state) => state.itemCount);

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={onOpen}>
      <ShoppingCart className="h-6 w-6" />
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-xs text-white font-bold">{itemCount}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
