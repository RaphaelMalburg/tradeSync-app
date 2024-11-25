export function StatsSection() {
  const stats = [
    { number: "10K+", label: "Active Traders" },
    { number: "1M+", label: "Trades Analyzed" },
    { number: "98%", label: "Customer Satisfaction" },
  ];

  return (
    <section className="py-20 border-t border-gray-200/10 dark:border-gray-800/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl rounded-2xl border border-gray-200/20 dark:border-white/[0.08] shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] transition-all duration-300 hover:translate-y-[-8px] hover:bg-white/20 dark:hover:bg-gray-900/30">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">{stat.number}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
