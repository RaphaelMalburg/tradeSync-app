"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Brush } from "recharts";
import { format } from "date-fns";
import { CustomTooltip } from "./CustomTooltip";
import { useEffect, useState } from "react";
import { getPerformance } from "@/lib/actions/performace";
import { useSearchParams } from "next/navigation";
import { User } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trade, PerformanceWithStats } from "@/types/index";

interface AnalyticsProps {
  userData: User;
}

export default function Analytics({ userData }: AnalyticsProps) {
  const [performance, setPerformance] = useState<PerformanceWithStats[]>([]);
  const [hourFilter, setHourFilter] = useState<string>("all");
  const [durationFilter, setDurationFilter] = useState<string>("all");
  const [pairFilter, setPairFilter] = useState<string>("all");
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId");

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const data = await getPerformance(userData?.id || "", accountId || undefined);
        setPerformance(
          data.map((p) => {
            const mappedTrades = (p.trades || []).map((t) => ({
              id: t.id,
              instrument: t.instrument,
              entryPrice: t.entryPrice,
              exitPrice: t.exitPrice,
              profitLoss: t.profitLoss,
              positionType: t.positionType || "Buy",
              entryTime: t.entryTime,
              exitTime: t.exitTime,
              duration: t.duration,
              sentiment: t.sentiment,
              strategyId: t.strategyId || undefined,
              strategyName: undefined,
              commission: t.commission || undefined,
              riskReward: t.riskReward || undefined,
              setup: t.setup,
              symbol: t.symbol || undefined,
              timeframe: t.timeframe || undefined,
            }));

            return {
              ...p,
              trades: mappedTrades,
              profitFactor: calculateProfitFactor(mappedTrades),
              hourlyStats: calculateHourlyStats(mappedTrades),
              durationStats: calculateDurationStats(mappedTrades),
              pairStats: calculatePairStats(mappedTrades),
            };
          })
        );
      } catch (error) {
        console.error("Failed to fetch performance data:", error);
      }
    };

    fetchPerformance();
  }, [accountId, userData]);

  const calculateProfitFactor = (trades: Trade[]) => {
    const grossProfit = trades.filter((t) => t.profitLoss > 0).reduce((sum, t) => sum + t.profitLoss, 0);
    const grossLoss = Math.abs(trades.filter((t) => t.profitLoss < 0).reduce((sum, t) => sum + t.profitLoss, 0));
    return grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
  };

  const calculateHourlyStats = (trades: Trade[]) => {
    return trades.reduce((acc, trade) => {
      const hour = new Date(trade.entryTime).getHours();
      if (!acc[hour]) acc[hour] = { count: 0, profit: 0, commission: 0 };
      acc[hour].count++;
      acc[hour].profit += trade.profitLoss;
      acc[hour].commission += trade.commission || 0;
      return acc;
    }, {} as Record<number, { count: number; profit: number; commission: number }>);
  };

  const calculateDurationStats = (trades: Trade[]) => {
    return trades.sort((a, b) => a.duration - b.duration);
  };

  const calculatePairStats = (trades: Trade[]) => {
    return trades.reduce((acc, trade) => {
      if (!acc[trade.instrument]) acc[trade.instrument] = { count: 0, profit: 0 };
      acc[trade.instrument].count++;
      acc[trade.instrument].profit += trade.profitLoss;
      return acc;
    }, {} as Record<string, { count: number; profit: number }>);
  };

  const renderMetricsCards = () => {
    const latestPerformance = performance[0] || ({} as PerformanceWithStats);
    const metrics = [
      {
        title: "Win Rate",
        value: `${latestPerformance.winRate?.toFixed(1)}%`,
        description: "Overall win percentage",
      },
      {
        title: "Profit Factor",
        value: latestPerformance.profitFactor?.toFixed(2),
        description: "Gross profit / Gross loss",
      },
      {
        title: "Total Commission",
        value: `$${latestPerformance.trades?.reduce((sum: number, t: Trade) => sum + (t.commission || 0), 0).toFixed(2)}`,
        description: "Total commission spent",
      },
      {
        title: "Avg R:R Ratio",
        value: (latestPerformance.trades?.reduce((sum: number, t: Trade) => sum + (t.riskReward || 0), 0) / (latestPerformance.trades?.length || 1)).toFixed(2),
        description: "Average Risk/Reward ratio",
      },
    ];

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Format performance data for charts
  const performanceData = performance.map((p) => ({
    date: format(new Date(p.createdAt), "MMM dd"),
    winRate: p.winRate,
    avgPL: p.averageProfitLoss,
    drawdown: p.maxDrawdown,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4 mb-6">
        <Select value={hourFilter} onValueChange={setHourFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by hour" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Hours</SelectItem>
            {Array.from({ length: 24 }).map((_, i) => (
              <SelectItem key={i} value={`${i}`}>
                {`${i}:00 - ${i + 1}:00`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={durationFilter} onValueChange={setDurationFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Durations</SelectItem>
            <SelectItem value="short">Less than 5 min</SelectItem>
            <SelectItem value="medium">5-15 min</SelectItem>
            <SelectItem value="long">More than 15 min</SelectItem>
          </SelectContent>
        </Select>

        <Select value={pairFilter} onValueChange={setPairFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by pair" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pairs</SelectItem>
            {Object.keys(performance[0]?.pairStats || {}).map((pair) => (
              <SelectItem key={pair} value={pair}>
                {pair}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {renderMetricsCards()}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Win Rate Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="winRate" stroke="#10b981" name="Win Rate" />
                <Brush dataKey="date" height={20} stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average P/L Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="avgPL" stroke="#3b82f6" name="Avg P/L" />
                <Brush dataKey="date" height={20} stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maximum Drawdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="drawdown" stroke="#ef4444" name="Drawdown" />
                <Brush dataKey="date" height={20} stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
