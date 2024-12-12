import { DashboardPerformanceDTO } from "@/lib/dto/dashboard.dto";

export function calculateEquityCurve(performance: DashboardPerformanceDTO): number {
  // Example logic to calculate equity curve
  // This should be replaced with your actual calculation logic
  return performance.averageProfitLoss * performance.trades.length; // Using trades.length instead of totalTrades
}
