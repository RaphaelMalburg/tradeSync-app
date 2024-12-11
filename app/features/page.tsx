import { Sparkles } from "@/components/ui/sparkles";
import { BarChart2, Brain, LineChart, PieChart, History, TrendingUp, Bot, Shield, RefreshCw } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: <BarChart2 className="h-6 w-6" />,
      title: "Advanced Analytics",
      description: "Comprehensive trading analytics with detailed performance metrics and custom reports.",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Insights",
      description: "Get personalized trading insights and pattern recognition powered by machine learning.",
    },
    {
      icon: <History className="h-6 w-6" />,
      title: "Trade History",
      description: "Automatically track and analyze your complete trading history from cTrader.",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Performance Tracking",
      description: "Monitor your trading performance with real-time metrics and historical data.",
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "Smart Alerts",
      description: "Receive intelligent notifications about your trading patterns and potential improvements.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Risk Management",
      description: "Advanced risk analysis tools to help you maintain healthy trading practices.",
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Custom Reports",
      description: "Generate detailed trading reports with customizable metrics and timeframes.",
    },
    {
      icon: <PieChart className="h-6 w-6" />,
      title: "Portfolio Analysis",
      description: "Analyze your portfolio distribution and performance across different instruments.",
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Real-time Sync",
      description: "Automatic synchronization with your cTrader account for up-to-date analysis.",
    },
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-gray-50/50 to-gray-100/50 dark:from-[#0A0F1C] dark:via-[#0A0F1C] dark:to-[#0A0F1C]">
      <div className="absolute inset-0 overflow-hidden">
        <Sparkles background="transparent" minSize={0.4} maxSize={1} particleCount={100} className="w-full h-full" particleColor="#3B82F6" />
      </div>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful Features for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600"> Smart Trading</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl mb-8">Everything you need to analyze, track, and improve your trading performance</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl
                  rounded-2xl border border-gray-200/20 dark:border-white/[0.08]
                  shadow-lg transition-all duration-300 hover:translate-y-[-8px]
                  hover:bg-white/20 dark:hover:bg-gray-900/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <div className="text-blue-500 dark:text-blue-400">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
