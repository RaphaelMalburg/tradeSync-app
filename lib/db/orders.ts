import { db } from "@/lib/db";

export async function createOrder(orderData: { userId: string; sessionId: string; items: any[]; total: number; email: string }) {
  return await db.order.create({
    data: {
      userId: orderData.userId,
      sessionId: orderData.sessionId,
      items: orderData.items,
      total: orderData.total,
      email: orderData.email,
      status: "completed",
    },
  });
}
