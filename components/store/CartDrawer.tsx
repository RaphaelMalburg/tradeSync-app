"use client";

import * as React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useCartStore } from "@/lib/store/cart";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { CartDrawerContent } from "./CartDrawerContent";

export function CartDrawer() {
  const [isOpen, setIsOpen] = React.useState(false);
  const itemCount = useCartStore((state) => state.itemCount);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
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
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Your Shopping Cart</DrawerTitle>
            <DrawerDescription>Review your items before checkout</DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0">
            <CartDrawerContent />
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Continue Shopping</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
