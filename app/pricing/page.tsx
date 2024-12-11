import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
}

export default function PricingPage() {
  const pricingTiers: PricingTier[] = [
    {
      name: "14-Day Trial",
      price: "Free",
      description: "Experience all Pro features for 14 days",
      features: ["Full access to all features", "AI-powered insights", "Advanced analytics", "Real-time sync", "Custom reports", "Priority support", "No credit card required"],
      buttonText: "Start Free Trial",
    },
    {
      name: "Advanced",
      price: "$12.99",
      description: "Everything you need for professional trading",
      features: [
        "Unlimited trade tracking",
        "AI-powered insights",
        "Advanced analytics dashboard",
        "Real-time market sync",
        "Custom reports & exports",
        "Priority 24/7 support",
        "API access",
        "Team collaboration tools",
      ],
      buttonText: "Get Started",
      highlighted: true,
    },
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-gray-50/50 to-gray-100/50 dark:from-[#0A0F1C] dark:via-[#0A0F1C] dark:to-[#0A0F1C]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px] animate-blob" />
        <div className="absolute -bottom-8 -left-4 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Simple, Transparent <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Pricing</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl">Start with a free trial or go Pro for unlimited access</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`p-8 bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl
                rounded-2xl border
                ${tier.highlighted ? "ring-2 ring-blue-500 scale-105" : ""}`}>
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{tier.name}</h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {tier.price}
                  {tier.price !== "Custom" && <span className="text-lg">/mo</span>}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-600 dark:text-gray-400">
                    <Check className="h-5 w-5 text-blue-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className={`w-full ${tier.highlighted ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-800 hover:bg-gray-700"}`}>
                <Link href="/signup" className="w-full">
                  {tier.buttonText}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
