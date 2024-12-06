import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, BarChart2, Timer } from "lucide-react";
import { DashboardPerformanceDTO } from "@/lib/dto/dashboard.dto";
import { formatCurrency } from "@/lib/formatters";

interface PerformanceMetricsProps {
  performance: DashboardPerformanceDTO;
}

export function PerformanceMetrics({ performance }: PerformanceMetricsProps) {
  const metrics = [
    {
      title: "Account Return",
      value: formatCurrency(performance.averageProfitLoss * performance.totalTrades),
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      description: "Total return",
    },
    {
      title: "Profit Factor",
      value: performance.profitFactor.toFixed(2),
      icon: <BarChart2 className="h-4 w-4 text-muted-foreground" />,
      description: "Gross profit / Gross loss",
    },
    {
      title: "Win Rate",
      value: `${performance.winRate.toFixed(1)}%`,
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      description: `${performance.consecutiveWins} win streak`,
    },
    {
      title: "Avg Duration",
      value: `${performance.averageHoldingTime} min`,
      icon: <Timer className="h-4 w-4 text-muted-foreground" />,
      description: "Per trade",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
