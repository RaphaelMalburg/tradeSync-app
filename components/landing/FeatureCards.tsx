import { BarChart2, PieChart, Zap } from "lucide-react";

export function FeatureCards() {
  const features = [
    {
      icon: <BarChart2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: "Advanced Analytics",
      description: "Get in-depth performance metrics and visualizations",
    },
    {
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      title: "AI-Powered Insights",
      description: "Uncover hidden patterns and improve your strategy with AI",
    },
    {
      icon: <PieChart className="h-6 w-6 text-blue-600" />,
      title: "Portfolio Management",
      description: "Track and optimize your trading portfolio effectively",
    },
  ];

  return (
    <div className="w-full lg:w-1/2">
      <div className="space-y-4 md:space-y-6 max-w-lg mx-auto lg:ml-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="w-full p-6 bg-white dark:bg-gray-900/20 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/[0.08] shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] transition-all duration-300 hover:translate-y-[-8px] hover:bg-gray-50 dark:hover:bg-gray-900/30">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">{feature.icon}</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
