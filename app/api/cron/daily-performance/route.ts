import { handleDailyPerformanceCalculation } from "@/lib/cron/performance-cron";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Vercel cron job endpoint - runs daily at midnight
export async function GET() {
  try {
    await handleDailyPerformanceCalculation();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Add this to your vercel.json
export const config = {
  cron: "0 0 * * *", // Runs at midnight every day
};
