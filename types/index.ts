import { ReactNode } from "react";
import { Sentiment } from "@prisma/client";
import { DashboardPerformanceDTO } from "@/lib/dto/dashboard.dto";
export interface User {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  imageUrl: string;
  apiKey?: string;
}

export interface Account {
  id: string;
  name: string;
  accountType: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "TradingBot" | "Plugin" | "Indicator";
  icon: ReactNode;
  features: string[];
}

export interface CartItems extends Product {
  quantity: number;
}

export interface Trade {
  id: string;
  instrument: string;
  entryPrice: number;
  exitPrice: number;
  profitLoss: number;
  positionType: string;
  entryTime: Date;
  exitTime: Date;
  duration: number;
  sentiment: Sentiment;
  strategyId?: string;
  strategyName?: string;
  commission?: number;
  riskReward?: number;
  setup: string[];
  symbol?: string;
  timeframe?: string;
}

export interface PerformanceWithStats extends DashboardPerformanceDTO {
  trades: Trade[];
  profitFactor: number;
  hourlyStats: Record<number, { count: number; profit: number; commission: number }>;
  durationStats: Trade[];
  pairStats: Record<string, { count: number; profit: number }>;
}
