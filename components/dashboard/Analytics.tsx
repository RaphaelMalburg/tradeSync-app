"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { CustomTooltip } from "./CustomTooltip";
import { DashboardPerformanceDTO } from "@/lib/dto/dashboard.dto";
import { useEffect, useState } from "react";
import { getPerformance } from "@/lib/actions/performace";

export default function Analytics() {
  const [performance, setPerformance] = useState<DashboardPerformanceDTO[]>([]);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const data = await getPerformance();
        setPerformance(data);
      } catch (error) {
        console.error("Failed to fetch performance data:", error);
      }
    };

    fetchPerformance();
  }, []);

  const performanceData = performance
    .slice()
    .reverse()
    .map((p) => ({
      date: format(new Date(p.createdAt), "MMM dd"),
      winRate: p.winRate,
      avgPL: p.averageProfitLoss,
      drawdown: p.maxDrawdown,
    }));

  return (
    <div className="p-6 space-y-6">
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
                <Line type="monotone" dataKey="winRate" stroke="#8884d8" />
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
                <Line type="monotone" dataKey="avgPL" stroke="#82ca9d" />
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
                <Line type="monotone" dataKey="drawdown" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
