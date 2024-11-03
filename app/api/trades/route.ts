import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, PositionType } from "@prisma/client";

const prisma = new PrismaClient();

interface TradeData {
  tradeId: string;
  instrument: string;
  entryPrice: number;
  positionSize: number;
  profitLoss: number;
  entryTime: string;
  stopLoss: number;
  takeProfit: number;
  positionType: string;
  status: "open" | "update" | "closed";
  duration: number;
}

// Simplified API key validation
async function isValidApiKey(apiKey: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        apiKey,
      },
    });
    return user !== null;
  } catch (error) {
    console.error("Error validating API key:", error);
    return false;
  }
}

// Simplified user retrieval
async function getUserByApiKey(apiKey: string) {
  return await prisma.user.findFirst({
    where: {
      apiKey,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const providedApiKey = authHeader?.replace("Bearer ", "");

    if (!providedApiKey) {
      return NextResponse.json({ error: "No API key provided" }, { status: 401 });
    }

    const isValid = await isValidApiKey(providedApiKey);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const user = await getUserByApiKey(providedApiKey);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tradeData: TradeData = await req.json();
    const positionType = tradeData.positionType.toUpperCase() === "BUY" ? PositionType.Buy : PositionType.Sell;

    switch (tradeData.status) {
      case "open": {
        await prisma.trade.create({
          data: {
            tradeId: tradeData.tradeId,
            instrument: tradeData.instrument,
            entryPrice: tradeData.entryPrice,
            exitPrice: 0,
            positionSize: tradeData.positionSize,
            profitLoss: tradeData.profitLoss,
            entryTime: new Date(tradeData.entryTime),
            exitTime: new Date(),
            duration: tradeData.duration,
            stopLoss: tradeData.stopLoss,
            takeProfit: tradeData.takeProfit,
            positionType: positionType,
            userId: user.id,
          },
        });
        break;
      }
      case "update": {
        await prisma.trade.update({
          where: {
            tradeId: tradeData.tradeId,
          },
          data: {
            profitLoss: tradeData.profitLoss,
            duration: tradeData.duration,
            stopLoss: tradeData.stopLoss,
            takeProfit: tradeData.takeProfit,
          },
        });
        break;
      }
      case "closed": {
        await prisma.trade.update({
          where: {
            tradeId: tradeData.tradeId,
          },
          data: {
            exitPrice: tradeData.entryPrice,
            profitLoss: tradeData.profitLoss,
            exitTime: new Date(),
            duration: tradeData.duration,
          },
        });

        const userTrades = await prisma.trade.findMany({
          where: {
            userId: user.id,
          },
        });

        const winningTrades = userTrades.filter((trade) => trade.profitLoss > 0);
        const winRate = (winningTrades.length / userTrades.length) * 100;
        const averageProfitLoss = userTrades.reduce((sum, trade) => sum + trade.profitLoss, 0) / userTrades.length;
        const averageHoldingTime = Math.floor(userTrades.reduce((sum, trade) => sum + trade.duration, 0) / userTrades.length);
        const maxDrawdown = userTrades.reduce((maxDD, trade) => Math.min(maxDD, trade.profitLoss), 0);

        await prisma.performance.create({
          data: {
            userId: user.id,
            winRate,
            averageProfitLoss,
            averageHoldingTime,
            maxDrawdown,
          },
        });
        break;
      }
      default: {
        return NextResponse.json({ error: "Invalid trade status" }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing trade:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
