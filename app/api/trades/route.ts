// app/api/trades/route.ts
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
