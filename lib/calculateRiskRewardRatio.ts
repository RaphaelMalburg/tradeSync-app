import { DashboardPerformanceDTO } from "./dto/dashboard.dto";

export function calculateRiskRewardRatio(performance: DashboardPerformanceDTO) {
  // Calculate average risk and average reward
  const averageRisk = performance.averageRisk || 1; // Default to 1 to avoid division by zero
  const averageReward = performance.averageReward || 0;

  // Calculate risk/reward ratio
  return averageReward / averageRisk; // Simplified example
}
