import { NextRequest, NextResponse } from "next/server";
import { updateUserPerformanceMetrics } from "@/services/performanceService"; // Import the new service
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log("Received Data:", data); // Log incoming data for inspection
  try {
    // Validate API key from headers
    const apiKey = req.headers.get("x-api-key");
    console.log("API Key:", apiKey);
    if (!apiKey) {
      console.log("Error: API key is required");
      return NextResponse.json({ error: "API key is required" }, { status: 401 });
    }

    // Find user by API key
    const user = await db.user.findUnique({
      where: { apiKey },
    });

    if (!user) {
      console.log("Error: Invalid API key");
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const eventType = data.eventType;
    console.log("Event Type:", eventType); // Log the event type

    // Handle chart screenshot if present
    let screenshotUrl = null;
    if (data.chartScreenshot) {
      try {
        const base64Data = data.chartScreenshot.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        // Generate unique filename
        const filename = `${Date.now()}-${data.tradeId}.png`;

        // Upload to Supabase Storage
        const { data: uploadData, error } = await supabase.storage.from("trade-charts").upload(filename, buffer, {
          contentType: "image/png",
          cacheControl: "3600",
        });

        if (error) throw error;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("trade-charts").getPublicUrl(filename);

        screenshotUrl = publicUrl;
      } catch (error) {
        console.error("Error uploading chart screenshot:", error);
        // Continue processing even if screenshot upload fails
      }
    }

    if (eventType === "POSITION_OPENED") {
      // Handle position opening
      console.log("Handling POSITION_OPENED event");
      await db.position.create({
        data: {
          positionId: data.tradeId,
          price: data.entryPrice,
          timestamp: new Date(data.entryTime),
          rawData: JSON.stringify(data),
        },
      });

      return NextResponse.json({ message: "Position recorded" }, { status: 201 });
    } else if (eventType === "POSITION_CLOSED") {
      // Create or update trade record
      console.log("Handling POSITION_CLOSED event");
      const trade = await db.trade.create({
        data: {
          tradeId: data.tradeId,
          userId: user.id,
          instrument: data.instrument,
          entryPrice: data.entryPrice,
          exitPrice: data.exitPrice,
          positionSize: data.positionSize,
          profitLoss: data.profitLoss,
          entryTime: new Date(data.entryTime),
          exitTime: new Date(data.exitTime),
          duration: data.duration,
          stopLoss: data.stopLoss ? data.stopLoss : undefined,
          takeProfit: data.takeProfit ? data.takeProfit : undefined,
          strategy: data.strategy,
          notes: data.notes,
          positionType: data.positionType === "BUY" ? "Buy" : "Sell",
          sentiment: data.profitLoss > 0 ? "Positive" : data.profitLoss < 0 ? "Negative" : "Neutral",
          accountId: data.accountId,
          screenshotUrl,
        },
      });

      // Generate AI insight for the trade
      const aiInsight = await generateTradeInsight(trade);
      await db.aIInsight.create({
        data: {
          tradeReference: trade.tradeId,
          userId: user.id,
          insightText: aiInsight,
        },
      });

      // Update user's performance metrics
      await updateUserPerformanceMetrics(user.id); // Call to the service to update performance metrics

      return NextResponse.json(
        {
          message: "Trade recorded successfully",
          tradeId: trade.tradeId,
        },
        { status: 201 }
      );
    }

    console.log("Error: Invalid event type");
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  } catch (error) {
    console.error("Error processing trade:", error);
    console.error("Received Data:", data); // Log the incoming data
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

interface Trade {
  instrument: string;
  profitLoss: number;
  duration: number;
  entryPrice: number;
  exitPrice: number;
}

async function generateTradeInsight(trade: Trade) {
  // Implement your AI insight generation logic here
  // This could involve calling an AI service or implementing custom logic
  return `Trade analysis for ${trade.instrument}:
          ${trade.profitLoss > 0 ? "Profitable" : "Loss"} trade with
          ${trade.duration} seconds duration.
          Entry: ${trade.entryPrice}, Exit: ${trade.exitPrice}`;
}
