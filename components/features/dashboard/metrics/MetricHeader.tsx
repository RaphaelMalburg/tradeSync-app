import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface MetricsHeaderProps {
  accumulatedReturn: number;
  profitFactor: number;
  averageReturn: number;
  winRate: number;
  sparklineData?: Array<{ date: string; value: number }>;
}

export function MetricsHeader({ accumulatedReturn, profitFactor, averageReturn, winRate, sparklineData = [] }: MetricsHeaderProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="bg-background/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Acc. Return $</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Accumulated Return: The total profit or loss from all trades combined</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold">${accumulatedReturn.toLocaleString()}</p>
          </div>
          <ResponsiveContainer width="100%" height={35}>
            <LineChart data={sparklineData}>
              <YAxis hide domain={["auto", "auto"]} />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-background/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Profit Factor</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Profit Factor: Ratio of gross profit to gross loss. Above 1.0 indicates profitable trading</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold">{profitFactor.toFixed(2)}</p>
          </div>
          <ResponsiveContainer width="100%" height={35}>
            <LineChart data={sparklineData}>
              <YAxis hide domain={["auto", "auto"]} />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-background/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Avg Return $</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Average Return: The mean profit/loss per trade</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold">${averageReturn.toFixed(2)}</p>
          </div>
          <ResponsiveContainer width="100%" height={35}>
            <LineChart data={sparklineData}>
              <YAxis hide domain={["auto", "auto"]} />
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-background/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Win %</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Win Rate: Percentage of trades that resulted in profit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold">{winRate.toFixed(2)}%</p>
          </div>
          <div className="mt-2">
            <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="absolute h-full bg-blue-500 transition-all duration-500" style={{ width: `${winRate}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
