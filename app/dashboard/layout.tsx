"use client";

import { Activity, BarChart, TrendingUp, BrainCircuit } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const dashboardItems = [
    { label: "Overview", href: "/dashboard", icon: <BarChart className="h-5 w-5" /> },
    { label: "Trades", href: "/dashboard/trades", icon: <Activity className="h-5 w-5" /> },
    { label: "Analytics", href: "/dashboard/analytics", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Insights", href: "/dashboard/insights", icon: <BrainCircuit className="h-5 w-5" /> },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Content */}
      <div className="flex-1 pb-16 md:pb-0">{children}</div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-lg md:hidden">
        <div className="grid grid-cols-4 px-2 py-1">
          {dashboardItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 text-xs
                ${pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
              {item.icon}
              <span className="mt-1 text-[10px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
