import Link from "next/link";
import { ArrowRight, BarChart2, BookOpen, PieChart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { checkUser } from "@/lib/checkUser";
import TradesList from "@/components/TradesList";
import { Chat } from "@/components/Chat";

export default async function LandingPage() {
  const user = await checkUser();
  if (!user) {
    // Handle the case where user is null, e.g., redirect or return an error message
    return <div>User not found</div>; // Example response
  }
  const trades = await db.trade
    .findMany({
      where: {
        userId: user.id,
      },
    })
    .then((trades) =>
      trades.map((trade) => ({
        ...trade,
        entryTime: trade.entryTime.toISOString(), // Convert Date to string
        exitTime: trade.exitTime.toISOString(), // Convert Date to string
      }))
    );
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-900">
      <main className="flex-grow">
        {/* Hero Section         <Chat />*/}
        <Chat userId={user.id} />
        <section className="py-24 text-center bg-gradient-to-b from-blue-500 to-blue-300 dark:from-blue-900 dark:to-blue-700">
          <div className="container mx-auto px-6">
            <h1 className="text-5xl font-extrabold mb-6 text-white transition-transform duration-300 hover:scale-105">Master Your Trades with AI-Powered Insights</h1>
            <p className="text-lg mb-8 text-white">Elevate your cTrader experience with our advanced journal and analysis tool</p>
            <div className="flex justify-center gap-6">
              <Button asChild size="lg" className="transition-transform duration-300 hover:scale-105 bg-white text-blue-900">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="transition-transform duration-300 hover:scale-105 border-white ">
                <Link href="/demo">See Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-gray-200">Powerful Features for Serious Traders</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { icon: BookOpen, title: "Automatic Trade Logging", description: "Seamlessly log your trades with our custom cTrader plugin" },
                { icon: BarChart2, title: "Advanced Analytics", description: "Get in-depth performance metrics and visualizations" },
                { icon: Zap, title: "AI-Powered Insights", description: "Uncover hidden patterns and improve your strategy with AI" },
                { icon: PieChart, title: "Comprehensive Reports", description: "Generate detailed reports to track your progress over time" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                  <feature.icon className="h-12 w-12 mb-4 text-blue-600" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-gray-200">How It Works</h2>
            <ol className="grid md:grid-cols-3 gap-10">
              {[
                { title: "Connect", description: "Link your cTrader account with our secure API integration" },
                { title: "Trade", description: "Continue trading as usual while we automatically log your activity" },
                { title: "Analyze", description: "Access powerful insights and improve your trading strategies" },
              ].map((step, index) => (
                <li
                  key={index}
                  className="flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4">{index + 1}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 bg-gradient-to-b from-blue-500 to-blue-300 dark:from-blue-700 dark:to-blue-500">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">Ready to Elevate Your Trading?</h2>
            <p className="text-lg mb-8 text-white">Join thousands of traders who are already benefiting from our powerful analysis tools</p>
            <Button asChild size="lg" className="transition-transform duration-300 hover:scale-105 bg-white text-blue-600">
              <Link href="/signup" className="inline-flex items-center">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Display Trades Section */}
        <section className="py-24 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-gray-200">Your Trades</h2>
            <TradesList trades={trades} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t bg-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-400 dark:text-gray-200">© {new Date().getFullYear()} cTrader Journal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
