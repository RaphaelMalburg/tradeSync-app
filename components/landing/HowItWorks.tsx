import { BarChart2, PieChart, Zap } from "lucide-react";

export function HowItWorks() {
  return (
    <section className="relative py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          How It <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Works</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="h-6 w-6" />,
              title: "Connect",
              description: "Link your cTrader account securely",
            },
            {
              icon: <BarChart2 className="h-6 w-6" />,
              title: "Trade",
              description: "We automatically log your activity",
            },
            {
              icon: <PieChart className="h-6 w-6" />,
              title: "Analyze",
              description: "Access AI-powered trading insights",
            },
          ].map((step, index) => (
            <div key={index} className="relative">
              <div
                className="p-6
                bg-white/10 dark:bg-gray-900/20
                backdrop-blur-xl
                rounded-2xl
                border border-gray-200/20 dark:border-white/[0.08]
                shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)]
                transition-all duration-300 hover:translate-y-[-8px]
                hover:bg-white/20 dark:hover:bg-gray-900/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <div className="text-blue-500 dark:text-blue-400">{step.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
