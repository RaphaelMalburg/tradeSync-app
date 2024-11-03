// app/api/trades/route.ts
// app/api/positions/add/route.ts
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get the raw body as text since cTrader sends it as form data
    const rawBody = await req.text();

    // Parse the form data (pid=123&ep=1.2345&et=2024-01-01...)
    const params = new URLSearchParams(rawBody);

    const positionData = {
      positionId: params.get("pid"),
      price: parseFloat(params.get("ep") || "0"),
      time: new Date(params.get("et") || ""),
      // You might want to add these to your database
      receivedAt: new Date(),
      rawData: rawBody,
    };

    // Log the received data
    console.log("Received position data:", positionData);

    // Here you would typically save to your database
    // Example with prisma:
    // await prisma.position.create({
    //     data: {
    //         positionId: positionData.positionId,
    //         price: positionData.price,
    //         timestamp: positionData.time,
    //         rawData: positionData.rawData
    //     }
    // })

    return new Response(
      JSON.stringify({
        success: true,
        message: "Position data received",
        data: positionData,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing position data:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Error processing position data",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// To handle preflight requests if needed
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

/*
import { NextRequest, NextResponse } from "next/server";

// Define the expected payload structure
interface TradePayload {
  symbol: string;
  entryPrice: number;
  timestamp: string;
  positionType: string;
  volume: number;
}

// Validate the payload
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidTradePayload(payload: any): payload is TradePayload {
  return (
    typeof payload === "object" &&
    typeof payload.symbol === "string" &&
    typeof payload.entryPrice === "number" &&
    typeof payload.timestamp === "string" &&
    typeof payload.positionType === "string" &&
    typeof payload.volume === "number"
  );
}

export async function POST(request: NextRequest) {
  try {
    // Verify content type
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
    }

    // Parse the request body
    const payload = await request.json();

    // Validate the payload
    if (!isValidTradePayload(payload)) {
      return NextResponse.json({ error: "Invalid payload structure" }, { status: 400 });
    }

    // Log the entire received payload
    console.log("Received trade payload:", payload);

    // Log the trade data (replace with your preferred storage solution)
    console.log("Processed trade data:", {
      symbol: payload.symbol,
      entryPrice: payload.entryPrice,
      timestamp: new Date(payload.timestamp),
      positionType: payload.positionType,
      volume: payload.volume,
    });

    // Here you would typically:
    // 1. Store the trade in your database
    // 2. Trigger any notifications
    // 3. Process the trade data as needed

    // Send success response
    return NextResponse.json(
      {
        success: true,
        message: `Successfully received trade for ${payload.symbol}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing trade webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Optionally, implement a GET method for testing
export async function GET() {
  return NextResponse.json({ message: "Trade webhook endpoint is running" }, { status: 200 });
}

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
      apiKey: apiKey,
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

*/
