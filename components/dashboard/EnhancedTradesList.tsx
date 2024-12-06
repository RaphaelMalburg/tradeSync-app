import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DashboardTradeDTO } from "@/lib/dto/dashboard.dto";
import { formatCurrency } from "@/lib/formatters";

interface EnhancedTradesListProps {
  trades: DashboardTradeDTO[];
}

export function EnhancedTradesList({ trades }: EnhancedTradesListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Setup</TableHead>
          <TableHead>Entry</TableHead>
          <TableHead>Exit</TableHead>
          <TableHead>R:R</TableHead>
          <TableHead className="text-right">P/L</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.map((trade) => (
          <TableRow key={trade.id} className="cursor-pointer hover:bg-muted/50">
            <TableCell>
              <Badge variant={trade.profitLoss > 0 ? "success" : "destructive"}>{trade.profitLoss > 0 ? "WIN" : "LOSS"}</Badge>
            </TableCell>
            <TableCell>{format(new Date(trade.entryTime), "MMM dd, HH:mm")}</TableCell>
            <TableCell className="font-medium">{trade.instrument}</TableCell>
            <TableCell>
              <div className="flex gap-1 flex-wrap">
                {trade.setup.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>{formatCurrency(trade.entryPrice)}</TableCell>
            <TableCell>{formatCurrency(trade.exitPrice)}</TableCell>
            <TableCell>{trade.riskReward?.toFixed(2) || "-"}</TableCell>
            <TableCell className={`text-right ${trade.profitLoss > 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(trade.profitLoss)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
