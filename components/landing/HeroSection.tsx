import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { FeatureCards } from "./FeatureCards";

export function HeroSection() {
  return (
    <section className="relative py-20">
      <BackgroundBeams className="bg-transpar" />
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
          <div className="w-full lg:w-1/2 space-y-8">
            <h1 className="text-5xl md:text-5xl lg:text-7xl font-bold leading-tight text-gray-900 dark:text-white">
              Master Your Trades with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">AI-Powered Insights</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl">Elevate your cTrader experience with our advanced journal and analysis tool</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                <Link href="/signup" className="flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-gray-700 hover:bg-gray-800/50">
                <Link href="/demo">See Demo</Link>
              </Button>
            </div>
          </div>
          <FeatureCards />
        </div>
      </div>
    </section>
  );
}
