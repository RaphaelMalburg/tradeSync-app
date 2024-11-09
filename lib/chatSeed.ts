import { db } from "./db";

export async function fetchUserTrades(userId: string) {
  const trades = await db.trade.findMany({
    where: { userId: userId },
    orderBy: { entryTime: "desc" }, // Order by entry time, most recent first
  });
  return trades;
}
