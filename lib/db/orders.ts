import { db } from "@/lib/db";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export async function createOrder(orderData: { userId: string; sessionId: string; items: OrderItem[]; total: number; email: string }) {
  return await db.order.create({
    data: {
      userId: orderData.userId,
      sessionId: orderData.sessionId,
      items: JSON.stringify(orderData.items),
      total: orderData.total,
      email: orderData.email,
      status: "completed",
    },
  });
}
