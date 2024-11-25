import React from "react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "John Doe",
      role: "Professional Trader",
      content: "This tool has completely transformed my trading strategy. The AI insights are incredibly valuable.",
    },
    {
      name: "Sarah Smith",
      role: "Day Trader",
      content: "The analytics and performance tracking have helped me identify patterns I never noticed before.",
    },
    {
      name: "Mike Johnson",
      role: "Forex Trader",
      content: "The automated trade logging and AI analysis save me hours of manual work every week.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-transparent via-white/5 to-gray-100/10 dark:from-transparent dark:via-gray-900/5 dark:to-gray-900/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          Trusted by <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Traders</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6
                bg-white/10 dark:bg-gray-900/20
                backdrop-blur-xl
                rounded-2xl
                border border-gray-200/20 dark:border-white/[0.08]
                shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)]
                transition-all duration-300 hover:translate-y-[-8px]
                hover:bg-white/20 dark:hover:bg-gray-900/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10" />
                <div>
                  <div className="text-gray-900 dark:text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">&quot;{testimonial.content}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
