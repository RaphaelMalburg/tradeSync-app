import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Thompson",
      role: "Founder & CEO",
      description: "Former professional trader with 15 years of experience in algorithmic trading.",
    },
    {
      name: "Sarah Chen",
      role: "Head of AI",
      description: "PhD in Machine Learning, specialized in financial market pattern recognition.",
    },
    {
      name: "Michael Roberts",
      role: "Lead Developer",
      description: "Full-stack developer with expertise in building scalable trading platforms.",
    },
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-gray-50/50 to-gray-100/50 dark:from-[#0A0F1C] dark:via-[#0A0F1C] dark:to-[#0A0F1C]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/30 to-purple-100/30 dark:from-blue-500/5 dark:to-purple-500/5 rounded-full blur-[120px] opacity-50" />
      </div>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">cTrader Journal</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl mb-8">
              We&apos;re on a mission to revolutionize trading analysis through AI-powered insights and advanced analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400">
                We believe that every trader deserves access to professional-grade analytics and AI-powered insights. Our platform democratizes advanced trading analysis tools,
                making them accessible and user-friendly.
              </p>
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                <Link href="/signup" className="flex items-center">
                  Join Our Mission
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="p-6 bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl rounded-2xl border border-gray-200/20 dark:border-white/[0.08] shadow-lg">
              {/* Placeholder for an image or illustration */}

              <div className="aspect-video bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">Team</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="p-6 bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl rounded-2xl border border-gray-200/20 dark:border-white/[0.08] shadow-lg transition-all duration-300 hover:translate-y-[-8px]">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm mb-4">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
