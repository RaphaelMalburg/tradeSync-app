"use client";

import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

export function ChartContainer({ children }: { children: React.ReactNode }) {
  return (
    <Card className="p-4">
      <ResponsiveContainer width="100%" height={300}>
        {children}
      </ResponsiveContainer>
    </Card>
  );
}
