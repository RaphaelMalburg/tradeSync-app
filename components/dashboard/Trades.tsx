"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { DashboardTradeDTO } from "@/lib/dto/dashboard.dto";
import formatDuration from "@/lib/formatDuration";

interface TradesProps {
  trades: DashboardTradeDTO[];
}

export default function Trades({ trades }: TradesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("all");

  const totalPL = trades.reduce((sum, trade) => sum + trade.profitLoss, 0);

  // Filter and sort trades
  const filteredTrades = trades
    .filter((trade) => {
      if (filterBy === "winning") return trade.profitLoss > 0;
      if (filterBy === "losing") return trade.profitLoss < 0;
      return true;
    })
    .filter((trade) => trade.instrument.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trades.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((trades.filter((trade) => trade.profitLoss > 0).length / trades.length) * 100).toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Total P/L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPL > 0 ? "text-green-600" : "text-red-600"}`}>${totalPL.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(Math.floor(trades.reduce((sum, trade) => sum + trade.duration, 0) / trades.length))}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input placeholder="Search by instrument..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-xs" />
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter trades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Trades</SelectItem>
            <SelectItem value="winning">Winning Trades</SelectItem>
            <SelectItem value="losing">Losing Trades</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trades Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Instrument</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Exit</TableHead>
                <TableHead className="text-right">P/L</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.map((trade) => (
                <TableRow key={trade.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>{format(new Date(trade.entryTime), "MMM dd, HH:mm")}</TableCell>
                  <TableCell className="font-medium">{trade.instrument}</TableCell>
                  <TableCell>{trade.positionType}</TableCell>
                  <TableCell>${trade.entryPrice.toFixed(2)}</TableCell>
                  <TableCell>${trade.exitPrice.toFixed(2)}</TableCell>
                  <TableCell className={`text-right ${trade.profitLoss > 0 ? "text-green-600" : "text-red-600"}`}>${trade.profitLoss.toFixed(2)}</TableCell>
                  <TableCell>{formatDuration(trade.duration)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
