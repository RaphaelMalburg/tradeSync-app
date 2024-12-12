interface Trade {
  profitLoss: number;
  duration: number;
  entryTime: Date;
  exitTime?: Date; // Optional: added in case you want to use exit time for other metrics
  commission?: number; // Optional commission field
}

interface PerformanceMetrics {
  winRate: number;
  avgHoldingTime: number;
  avgProfitLoss: number;
  maxDrawdown: number;
}

// Function to calculate Win Rate
export function calculateWinRate(trades: Trade[]): number {
  if (!trades.length) return 0;

  const winningTrades = trades.filter((trade) => trade.profitLoss > 0);
  return (winningTrades.length / trades.length) * 100;
}

// Function to calculate Average Holding Time
export function calculateAverageHoldingTime(trades: Trade[]): number {
  if (!trades.length) return 0;

  const totalDuration = trades.reduce((sum, trade) => sum + trade.duration, 0);
  return totalDuration / trades.length;
}

// Function to calculate Average Profit/Loss
export function calculateAverageProfitLoss(trades: Trade[]): number {
  if (!trades.length) return 0;

  const totalProfitLoss = trades.reduce((sum, trade) => sum + trade.profitLoss, 0);
  return totalProfitLoss / trades.length;
}

// Function to calculate Maximum Drawdown
export function calculateMaxDrawdown(trades: Trade[]): number {
  if (!trades.length) return 0;

  let peak = -Infinity;
  let maxDrawdown = 0;
  let runningTotal = 0;

  // Sort trades by entry time to calculate drawdown in chronological order
  const sortedTrades = [...trades].sort((a, b) => a.entryTime.getTime() - b.entryTime.getTime());

  for (const trade of sortedTrades) {
    runningTotal += trade.profitLoss;

    if (runningTotal > peak) {
      peak = runningTotal;
    }

    const drawdown = ((peak - runningTotal) / peak) * 100; // Calculate drawdown as a percentage of the peak
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return maxDrawdown;
}

// Function that combines all the calculations into one PerformanceMetrics object
export function calculatePerformanceMetrics(trades: Trade[]): PerformanceMetrics {
  return {
    winRate: calculateWinRate(trades),
    avgHoldingTime: calculateAverageHoldingTime(trades),
    avgProfitLoss: calculateAverageProfitLoss(trades),
    maxDrawdown: calculateMaxDrawdown(trades),
  };
}

export function calculateAverageCommission(trades: Trade[]): number {
  if (!trades.length) return 0;
  const totalCommission = trades.reduce((sum, trade) => sum + (trade.commission || 0), 0);
  return totalCommission / trades.length;
}

export function calculateAverageWin(trades: Trade[]): number {
  const winningTrades = trades.filter((trade) => trade.profitLoss > 0);
  if (!winningTrades.length) return 0;
  return winningTrades.reduce((sum, trade) => sum + trade.profitLoss, 0) / winningTrades.length;
}

export function calculateAverageLoss(trades: Trade[]): number {
  const losingTrades = trades.filter((trade) => trade.profitLoss < 0);
  if (!losingTrades.length) return 0;
  return losingTrades.reduce((sum, trade) => sum + trade.profitLoss, 0) / losingTrades.length;
}

export function filterTradesByDate(trades: Trade[], days: number): Trade[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return trades.filter((trade) => trade.entryTime >= cutoffDate);
}
