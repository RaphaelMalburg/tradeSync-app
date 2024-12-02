"use client";

import * as React from "react";
import { BarChart, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Brush } from "recharts";
import { DashboardDTO } from "@/lib/dto/dashboard.dto";
import { format } from "date-fns";

// Map performance data for chart

export function DashboardContent({ performance, recentTrades }: DashboardDTO) {
  // Get the most recent performance metrics
  const latestPerformance = performance[0] || {
    winRate: 0,
    averageProfitLoss: 0,
    maxDrawdown: 0,
    averageHoldingTime: 0,
  };

  // Format performance data for charts
  const performanceData = performance
    .slice() // Create a copy
    .reverse() // Reverse to show oldest to newest
    .map((p) => ({
      date: format(new Date(p.createdAt), "MMM dd"),
      winRate: parseFloat(p.winRate.toFixed(3)),
      profitLoss: parseFloat(p.averageProfitLoss.toFixed(3)),
      maxDrawdown: parseFloat(p.maxDrawdown.toFixed(3)),
    }));

  return (
    <div className="flex-1 overflow-auto">
      <main className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestPerformance.winRate.toFixed(3)}%</div>
              <p className="text-xs text-muted-foreground">Last updated: {latestPerformance.createdAt ? format(new Date(latestPerformance.createdAt), "MMM dd, HH:mm") : "N/A"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Profit/Loss</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${latestPerformance.averageProfitLoss.toFixed(3)}</div>
              <p className="text-xs text-muted-foreground">Per trade</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${latestPerformance.maxDrawdown.toFixed(3)}</div>
              <p className="text-xs text-muted-foreground">Largest peak-to-trough drop</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentTrades.length}</div>
              <p className="text-xs text-muted-foreground">All-time trades</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="winRate" stroke="#8884d8" />
                <Line type="monotone" dataKey="profitLoss" stroke="#82ca9d" />
                <Brush dataKey="date" height={20} stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
