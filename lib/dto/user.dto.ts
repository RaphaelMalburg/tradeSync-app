// User DTOs
export interface CreateUserDTO {
  clerkUserId: string;
  name?: string;
  email: string;
  imageUrl?: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  imageUrl?: string;
}

// Trade DTOs
export interface CreateTradeDTO {
  tradeId: string;
  userId: string;
  instrument: string;
  entryPrice: number;
  exitPrice: number;
  positionSize: number;
  profitLoss: number;
  entryTime: Date;
  exitTime: Date;
  duration: number;
  stopLoss?: number;
  takeProfit?: number;
  screenshotUrl?: string;
  strategy?: string;
  notes?: string;
  positionType?: "Buy" | "Sell";
}

export interface UpdateTradeDTO {
  stopLoss?: number;
  takeProfit?: number;
  screenshotUrl?: string;
  strategy?: string;
  notes?: string;
}

// Performance DTOs
export interface CreatePerformanceDTO {
  accountId: string;
  userId: string;
  winRate: number;
  averageHoldingTime: number;
  averageProfitLoss: number;
  maxDrawdown: number;
}

export interface UpdatePerformanceDTO {
  winRate?: number;
  averageHoldingTime?: number;
  averageProfitLoss?: number;
  maxDrawdown?: number;
}

// AIInsight DTOs
export interface CreateAIInsightDTO {
  tradeReference: string;
  userId: string;
  insightText: string;
}

export interface UserStoreDTO {
  id: string;
  clerkUserId: string;
  name?: string;
  imageUrl?: string;
}
