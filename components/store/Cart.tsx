import { useCartStore } from "@/lib/store/cart";
import { CartItem } from "./CartItem";
import { Checkout } from "./Checkout";

export function Cart() {
  const { items, total } = useCartStore();

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}

      {items.length > 0 ? (
        <div className="space-y-4">
          <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
          <Checkout />
        </div>
      ) : (
        <div className="text-center py-8">Your cart is empty</div>
      )}
    </div>
  );
}
