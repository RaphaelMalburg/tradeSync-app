import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, PositionType } from "@prisma/client";

const prisma = new PrismaClient();

// Define types for the incoming trade data
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
  apiKey: string;
}

// Check if the provided API key is valid
async function isValidApiKey(apiKey: string) {
  const user = await prisma.user.findUnique({
    where: { apiKey: apiKey },
  });
  return user != null;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const providedApiKey = authHeader?.replace("Bearer ", "");

    if (!providedApiKey || !(await isValidApiKey(providedApiKey))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tradeData: TradeData = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const positionType = tradeData.positionType.toUpperCase() === "BUY" ? PositionType.Buy : PositionType.Sell;

    // Process the trade as per the previous logic
    // You can follow similar logic as you already had for open, update, and closed statuses

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing trade:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
