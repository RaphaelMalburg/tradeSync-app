"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DashboardDTO } from "@/lib/dto/dashboard.dto";
import { format } from "date-fns";
import { PerformanceMetrics } from "@/components/features/dashboard/metrics/PerformanceMetrics";
import { useUser } from "@clerk/nextjs";

export function DashboardContent({ performance }: DashboardDTO) {
  const { user } = useUser();

  // Prepare chart data
  const performanceData = performance.map((p) => ({
    date: format(new Date(p.createdAt), "MMM dd"),
    winRate: p.winRate,
    profitLoss: p.averageProfitLoss,
    profitFactor: p.profitFactor || 0,
  }));

  return (
    <div className="flex-1 overflow-auto">
      <main className="p-6">
        <PerformanceMetrics userId={user?.id || ""} accountId={undefined} />

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="winRate" name="Win Rate %" stroke="#8884d8" />
                <Line type="monotone" dataKey="profitLoss" name="Avg P/L" stroke="#82ca9d" />
                <Line type="monotone" dataKey="profitFactor" name="Profit Factor" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
