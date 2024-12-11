"use client";

import * as React from "react";
import { ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

export function ChartContainer({ children }: { children: React.ReactElement }) {
  return (
    <Card className="p-4">
      <ResponsiveContainer width="100%" height={300}>
        {children}
      </ResponsiveContainer>
    </Card>
  );
}
