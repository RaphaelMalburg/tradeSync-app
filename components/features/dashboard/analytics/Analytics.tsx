"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Brush } from "recharts";
import { format } from "date-fns";
import { CustomTooltip } from "./CustomTooltip";
import { DashboardPerformanceDTO } from "@/lib/dto/dashboard.dto";
import { useEffect, useState } from "react";
import { getPerformance } from "@/lib/actions/performace";
import { useSearchParams } from "next/navigation";
import { User } from "@prisma/client";

interface AnalyticsProps {
  userData: User;
}

export default function Analytics({ userData }: AnalyticsProps) {
  const [performance, setPerformance] = useState<DashboardPerformanceDTO[]>([]);
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId");

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const data = await getPerformance(userData?.id || "", accountId || undefined);
        setPerformance(
          data.map((p) => ({
            ...p,
            profitFactor: 0,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch performance data:", error);
      }
    };

    fetchPerformance();
  }, [accountId, userData]);

  const performanceData = performance
    .slice()
    .reverse()
    .map((p) => ({
      date: format(new Date(p.createdAt), "MMM dd"),
      winRate: parseFloat(p.winRate.toFixed(3)),
      avgPL: parseFloat(p.averageProfitLoss.toFixed(3)),
      drawdown: parseFloat(p.maxDrawdown.toFixed(3)),
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
                <Line type="monotone" dataKey="avgPL" stroke="#82ca9d" />
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
                <Line type="monotone" dataKey="drawdown" stroke="#ff7300" />
                <Brush dataKey="date" height={20} stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
