import { ReactNode } from "react";

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
