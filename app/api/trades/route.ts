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
async function isValidApiKey(apiKey: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        apiKey: {
          equals: apiKey,
        },
      },
    });
    return user !== null;
  } catch (error) {
    console.error("Error validating API key:", error);
    return false;
  }
}
async function getUserByApiKey(apiKey: string) {
  return await prisma.user.findUnique({
    where: {
      apiKey: apiKey,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const providedApiKey = authHeader?.replace("Bearer ", "");

    if (!providedApiKey || !(await isValidApiKey(providedApiKey))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByApiKey(providedApiKey);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tradeData: TradeData = await req.json();
    const positionType = tradeData.positionType.toUpperCase() === "BUY" ? PositionType.Buy : PositionType.Sell;

    switch (tradeData.status) {
      case "open": {
        // Create new trade
        await prisma.trade.create({
          data: {
            tradeId: tradeData.tradeId,
            instrument: tradeData.instrument,
            entryPrice: tradeData.entryPrice,
            exitPrice: 0, // Initial exit price
            positionSize: tradeData.positionSize,
            profitLoss: tradeData.profitLoss,
            entryTime: new Date(tradeData.entryTime),
            exitTime: new Date(), // Initial exit time
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
        // Update existing trade
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
        // Close the trade
        await prisma.trade.update({
          where: {
            tradeId: tradeData.tradeId,
          },
          data: {
            exitPrice: tradeData.entryPrice, // Using entryPrice as final price
            profitLoss: tradeData.profitLoss,
            exitTime: new Date(),
            duration: tradeData.duration,
          },
        });

        // Update performance metrics
        const userTrades = await prisma.trade.findMany({
          where: {
            userId: user.id,
          },
        });

        const winningTrades = userTrades.filter((trade) => trade.profitLoss > 0);
        const winRate = (winningTrades.length / userTrades.length) * 100;
        const averageProfitLoss = userTrades.reduce((sum, trade) => sum + trade.profitLoss, 0) / userTrades.length;
        const averageHoldingTime = Math.floor(userTrades.reduce((sum, trade) => sum + trade.duration, 0) / userTrades.length);

        // Calculate max drawdown
        const maxDrawdown = userTrades.reduce((maxDD, trade) => {
          return Math.min(maxDD, trade.profitLoss);
        }, 0);

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
