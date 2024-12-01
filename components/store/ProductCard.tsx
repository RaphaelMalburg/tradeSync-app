"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { HoverCard } from "./HoverCard";
import { useCartStore } from "@/lib/store/cart";
import { toast } from "@/lib/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: `${product.name} added to cart`,
    });
  };

  return (
    <HoverCard>
      <div className="bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl rounded-2xl border border-gray-200/20 dark:border-white/[0.08] p-6 transition-all duration-300 ">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg bg-blue-500/10">
            <div className="text-blue-500">{product.icon}</div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{product.name}</h3>
            <p className="text-blue-500 font-bold">${product.price}</p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">{product.description}</p>

        <ul className="space-y-2 mb-6">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>

        <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </HoverCard>
  );
}
