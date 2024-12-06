import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface PriceDistributionProps {
  data: {
    range: string;
    count: number;
    volume: number;
  }[];
}

export function PriceDistribution({ data }: PriceDistributionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Entry Price Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="volume" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
