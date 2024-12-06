import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Validate API key from headers
    const apiKey = req.headers.get("x-api-key");
    const accountId = req.headers.get("x-account-id") ?? "default"; // Add account ID header

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 401 });
    }

    if (!accountId) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 401 });
    }

    // Find user by API key
    const user = await db.user.findUnique({
      where: { apiKey },
      include: {
        Account: true, // Include accounts to validate accountId
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Validate account belongs to user
    if (accountId && !user.Account.some((account) => account.id === accountId)) {
      return NextResponse.json({ error: "Invalid account ID" }, { status: 401 });
    }

    const data = await req.json();
    const eventType = data.eventType;

    if (eventType === "POSITION_OPENED") {
      await db.trade.create({
        data: {
          userId: user.id,
          accountId: accountId,
          tradeId: data.tradeId,
          instrument: data.instrument,
          entryPrice: data.entryPrice,
          positionSize: data.positionSize,
          entryTime: new Date(data.entryTime),
          positionType: data.positionType,
          stopLoss: data.stopLoss,
          takeProfit: data.takeProfit,
          exitPrice: 0,
          profitLoss: 0,
          exitTime: new Date(),
          duration: 0,
          commission: data.commission,
        },
      });

      return NextResponse.json({ message: "Trade recorded" }, { status: 201 });
    } else if (eventType === "POSITION_CLOSED") {
      const trade = await db.trade.update({
        where: {
          tradeId: data.tradeId,
          userId: user.id,
        },
        data: {
          exitPrice: data.exitPrice,
          exitTime: new Date(data.exitTime),
          profitLoss: data.profitLoss,
          duration: data.duration,
          commission: data.commission,
        },
      });

      // Update performance metrics for the account
      await updateAccountPerformance(user.id, accountId);

      return NextResponse.json({ message: "Trade updated" }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function updateAccountPerformance(userId: string, accountId: string) {
  // Get all closed trades for this account
  const trades = await db.trade.findMany({
    where: {
      userId,
      accountId,
      exitPrice: { gt: 0 }, // Changed from not: null to gt: 0
    },
    orderBy: {
      exitTime: "desc",
    },
  });

  if (trades.length === 0) return;

  // Calculate performance metrics
  const winningTrades = trades.filter((t) => t.profitLoss > 0);
  const winRate = (winningTrades.length / trades.length) * 100;
  const averageProfitLoss = trades.reduce((sum, t) => sum + t.profitLoss, 0) / trades.length;

  // Calculate max drawdown
  let maxDrawdown = 0;
  let peak = 0;
  let runningPL = 0;

  trades.forEach((trade) => {
    runningPL += trade.profitLoss;
    if (runningPL > peak) {
      peak = runningPL;
    }
    const drawdown = peak - runningPL;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  // Update or create performance record
  await db.performance.create({
    data: {
      userId,
      accountId,
      winRate,
      averageProfitLoss,
      maxDrawdown,
      averageHoldingTime: trades.reduce((sum, t) => sum + t.duration, 0) / trades.length,
    },
  });
}
