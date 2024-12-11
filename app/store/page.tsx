import { Bot, LineChart, Gauge } from "lucide-react";
import { ProductGrid } from "@/components/store/ProductGrid";

const products = [
  {
    id: "bot-1",
    name: "SmartScalper Pro",
    description: "Advanced scalping bot with AI-powered entry and exit points",
    price: 299.99,
    category: "TradingBot" as const,
    icon: <Bot className="h-6 w-6" />,
    features: ["AI-powered market analysis", "Real-time trade execution", "Risk management system", "Custom parameter settings", "Performance analytics"],
  },
  {
    id: "bot-2",
    name: "TrendRider AI",
    description: "Automated trend following trading bot with machine learning",
    price: 399.99,
    category: "TradingBot" as const,
    icon: <Bot className="h-6 w-6" />,
    features: ["ML-powered trend detection", "Dynamic position sizing", "Multi-timeframe analysis", "Automated trade management", "Risk-adjusted returns"],
  },
  {
    id: "bot-3",
    name: "GridMaster Elite",
    description: "Advanced grid trading bot for sideways markets",
    price: 249.99,
    category: "TradingBot" as const,
    icon: <Bot className="h-6 w-6" />,
    features: ["Dynamic grid spacing", "Auto market condition detection", "Profit maximization", "Risk management", "Multiple pair support"],
  },
  {
    id: "plugin-1",
    name: "Risk Calculator Plus",
    description: "Advanced risk management plugin for precise position sizing",
    price: 49.99,
    category: "Plugin" as const,
    icon: <Gauge className="h-6 w-6" />,
    features: ["Position size calculator", "Risk percentage analysis", "Stop-loss optimizer", "Multi-currency support", "Custom risk profiles"],
  },
  {
    id: "plugin-2",
    name: "TradeJournal Pro",
    description: "Comprehensive trade journaling and analysis plugin",
    price: 79.99,
    category: "Plugin" as const,
    icon: <Gauge className="h-6 w-6" />,
    features: ["Trade logging", "Performance metrics", "Pattern recognition", "Trade replay", "Export capabilities"],
  },
  {
    id: "plugin-3",
    name: "CorrelationMatrix+",
    description: "Advanced correlation analysis for multiple instruments",
    price: 69.99,
    category: "Plugin" as const,
    icon: <Gauge className="h-6 w-6" />,
    features: ["Multi-asset correlation", "Dynamic updates", "Heat map visualization", "Custom timeframes", "Alert system"],
  },
  {
    id: "indicator-1",
    name: "TrendMaster Pro",
    description: "Multi-timeframe trend analysis indicator",
    price: 79.99,
    category: "Indicator" as const,
    icon: <LineChart className="h-6 w-6" />,
    features: ["Multi-timeframe analysis", "Trend strength indicator", "Support/Resistance levels", "Price action patterns", "Alert system"],
  },
  {
    id: "indicator-2",
    name: "VolumeFlow Elite",
    description: "Advanced volume analysis and order flow indicator",
    price: 89.99,
    category: "Indicator" as const,
    icon: <LineChart className="h-6 w-6" />,
    features: ["Volume profile", "Order flow analysis", "Delta volume", "Market absorption", "Custom alerts"],
  },
  {
    id: "indicator-3",
    name: "Harmonic Scanner",
    description: "Automated harmonic pattern detection indicator",
    price: 129.99,
    category: "Indicator" as const,
    icon: <LineChart className="h-6 w-6" />,
    features: ["Pattern recognition", "Risk/Reward calculator", "Multiple timeframes", "Custom pattern rules", "Alert notifications"],
  },
  {
    id: "indicator-4",
    name: "MarketProfile Pro",
    description: "Professional market profile and TPO charts",
    price: 149.99,
    category: "Indicator" as const,
    icon: <LineChart className="h-6 w-6" />,
    features: ["Value area analysis", "TPO charts", "Volume profile", "Session statistics", "POC tracking"],
  },
  {
    id: "bot-4",
    name: "NewsTrader AI",
    description: "Automated news event trading with NLP",
    price: 299.99,
    category: "TradingBot" as const,
    icon: <Bot className="h-6 w-6" />,
    features: ["News sentiment analysis", "Automated execution", "Risk management", "Custom news filters", "Performance tracking"],
  },
  {
    id: "plugin-4",
    name: "BacktestPro Suite",
    description: "Professional backtesting and strategy optimization",
    price: 199.99,
    category: "Plugin" as const,
    icon: <Gauge className="h-6 w-6" />,
    features: ["Strategy backtesting", "Monte Carlo simulation", "Walk-forward analysis", "Custom optimization", "Report generation"],
  },
  {
    id: "indicator-5",
    name: "WaveTrend Elite",
    description: "Advanced Elliott Wave analysis and prediction",
    price: 159.99,
    category: "Indicator" as const,
    icon: <LineChart className="h-6 w-6" />,
    features: ["Wave pattern detection", "Fibonacci analysis", "Time projections", "Wave counting", "Trading signals"],
  },
  {
    id: "plugin-5",
    name: "Portfolio Optimizer",
    description: "AI-powered portfolio optimization and risk management",
    price: 149.99,
    category: "Plugin" as const,
    icon: <Gauge className="h-6 w-6" />,
    features: ["Portfolio optimization", "Risk allocation", "Correlation analysis", "Rebalancing alerts", "Performance tracking"],
  },
  {
    id: "indicator-6",
    name: "OrderFlow Insights",
    description: "Deep order flow analysis and visualization",
    price: 179.99,
    category: "Indicator" as const,
    icon: <LineChart className="h-6 w-6" />,
    features: ["Footprint charts", "Order flow signals", "Volume analysis", "Liquidity levels", "Smart money tracking"],
  },
];

export default function StorePage() {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-gray-50/50 to-gray-100/50 dark:from-[#0A0F1C] dark:via-[#0A0F1C] dark:to-[#0A0F1C]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px] animate-blob" />
        <div className="absolute -bottom-8 -left-4 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        <h1 className="text-4xl font-bold text-center mb-4">
          Trading <span className="text-blue-500">Tools</span> Store
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-12">Enhance your trading with our professional tools and indicators</p>

        <ProductGrid initialProducts={products} />
      </div>
    </div>
  );
}
