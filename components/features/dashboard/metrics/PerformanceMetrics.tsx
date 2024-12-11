"use client";

import { useEffect, useState } from "react";
import { getCurrentDayPerformance } from "@/lib/actions/performance";
import { Card } from "@/components/ui/card";

interface Metrics {
  winRate: number;
  averageProfitLoss: number;
  totalTrades: number;
  averageHoldingTime: number;
}

export function PerformanceMetrics({ userId, accountId }: { userId: string; accountId?: string }) {
  const [currentMetrics, setCurrentMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      // Get real-time metrics
      const current = await getCurrentDayPerformance(userId, accountId);
      setCurrentMetrics(current);
    }

    loadMetrics();
    // Refresh real-time metrics every minute
    const interval = setInterval(loadMetrics, 60000);

    return () => clearInterval(interval);
  }, [userId, accountId]);

  if (!currentMetrics) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium">Today&apos;s Win Rate</h3>
        <p className="text-2xl font-bold">{currentMetrics.winRate.toFixed(2)}%</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium">Average P/L</h3>
        <p className="text-2xl font-bold">${currentMetrics.averageProfitLoss.toFixed(2)}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium">Total Trades</h3>
        <p className="text-2xl font-bold">{currentMetrics.totalTrades}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium">Avg Holding Time</h3>
        <p className="text-2xl font-bold">{(currentMetrics.averageHoldingTime / (1000 * 60)).toFixed(0)}m</p>
      </Card>
    </div>
  );
}
