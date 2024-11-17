"use client";

import * as React from "react";
import { BarChart, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

const performanceData = [
  { date: "2023-01-01", profit: 1000 },
  { date: "2023-02-01", profit: 1500 },
  { date: "2023-03-01", profit: 1200 },
  { date: "2023-04-01", profit: 2000 },
  { date: "2023-05-01", profit: 1800 },
  { date: "2023-06-01", profit: 2500 },
];

const recentTrades = [
  { id: 1, date: "2023-06-15", symbol: "AAPL", type: "Buy", amount: 100, price: 145.5 },
  { id: 2, date: "2023-06-14", symbol: "GOOGL", type: "Sell", amount: 50, price: 2500.75 },
  { id: 3, date: "2023-06-13", symbol: "MSFT", type: "Buy", amount: 75, price: 325.2 },
  { id: 4, date: "2023-06-12", symbol: "AMZN", type: "Sell", amount: 30, price: 3200.5 },
  { id: 5, date: "2023-06-11", symbol: "TSLA", type: "Buy", amount: 20, price: 650.75 },
];

export default function TradingDashboard() {
  return (
    <main className="p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>lol
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+18 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Trade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$50.40</div>
            <p className="text-xs text-muted-foreground">+$2.30 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                profit: {
                  label: "Profit",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>Your last 5 trades</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTrades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>{trade.date}</TableCell>
                    <TableCell>{trade.symbol}</TableCell>
                    <TableCell>{trade.type}</TableCell>
                    <TableCell>{trade.amount}</TableCell>
                    <TableCell>${trade.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
