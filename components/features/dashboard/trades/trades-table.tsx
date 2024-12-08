import { DashboardTradeDTO } from "@/lib/dto/dashboard.dto";
import { Strategy, Sentiment } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDuration } from "@/lib/utils";

interface TradesTableProps {
  trades: DashboardTradeDTO[];
  strategies: Strategy[];
  onUpdateStrategy: (tradeId: string, strategyId: string) => Promise<void>;
  onUpdateSentiment: (tradeId: string, sentiment: Sentiment) => Promise<void>;
}

export function TradesTable({ trades, strategies, onUpdateStrategy, onUpdateSentiment }: TradesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Instrument</TableHead>
          <TableHead>Entry Time</TableHead>
          <TableHead>Exit Time</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>P/L</TableHead>
          <TableHead>Strategy</TableHead>
          <TableHead>Sentiment</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.map((trade) => (
          <TableRow key={trade.id}>
            <TableCell>{trade.instrument}</TableCell>
            <TableCell>{new Date(trade.entryTime).toLocaleString()}</TableCell>
            <TableCell>{trade.exitTime ? new Date(trade.exitTime).toLocaleString() : "-"}</TableCell>
            <TableCell>{formatDuration(trade.duration)}</TableCell>
            <TableCell className={trade.profitLoss >= 0 ? "text-green-600" : "text-red-600"}>{trade.profitLoss.toFixed(2)}</TableCell>
            <TableCell>
              <Select value={trade.strategyId || "none"} onValueChange={(value) => onUpdateStrategy(trade.id, value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Strategy</SelectItem>
                  {strategies.map((strategy) => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Select value={trade.sentiment || "none"} onValueChange={(value) => onUpdateSentiment(trade.id, value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Sentiment</SelectItem>
                  <SelectItem value="GOOD">Good</SelectItem>
                  <SelectItem value="BAD">Bad</SelectItem>
                  <SelectItem value="NEUTRAL">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
