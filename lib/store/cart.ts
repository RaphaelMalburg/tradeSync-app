import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

export type CartItem = Product & {
  quantity: number;
  iconName?: string;
};

interface CartStore {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        const newItem = {
          ...product,
          icon: undefined,
          iconName: product.name,
          quantity: 1,
        };

        if (existingItem) {
          const updatedItems = items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
          set({
            items: updatedItems,
            total: calculateTotal(updatedItems),
            itemCount: calculateItemCount(updatedItems),
          });
        } else {
          const updatedItems = [...items, newItem];
          set({
            items: updatedItems,
            total: calculateTotal(updatedItems),
            itemCount: calculateItemCount(updatedItems),
          });
        }
      },
      removeItem: (productId) => {
        const updatedItems = get().items.filter((item) => item.id !== productId);
        set({
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        });
      },
      updateQuantity: (productId, quantity) => {
        const updatedItems = get()
          .items.map((item) => (item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item))
          .filter((item) => item.quantity > 0);
        set({
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        });
      },
      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
    }),
    {
      name: "cart-storage",
    }
  )
);

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const calculateItemCount = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};
