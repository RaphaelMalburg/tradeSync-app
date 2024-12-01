"use client";

import { useCartStore } from "@/lib/store/cart";
import { Product } from "@/types";
import { Button } from "../ui/button";
import { Minus, Plus, X } from "lucide-react";
import { Bot } from "lucide-react";

interface CartItemProps {
  item: Product & {
    quantity: number;
    id: string;
  };
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  // Render Bot icon by default or based on iconName
  const IconComponent = Bot;

  if (!item || typeof item !== "object") {
    return null;
  }

  return (
    <div className="bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl rounded-xl border border-gray-200/20 dark:border-white/[0.08] p-4">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <IconComponent className="h-6 w-6 text-blue-500" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
          <p className="text-blue-500 font-bold">${item.price}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 ml-2" onClick={() => removeItem(item.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
