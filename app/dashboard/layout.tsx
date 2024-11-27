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
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r bg-background/80 backdrop-blur-lg">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-xl font-semibold">Dashboard</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {dashboardItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors
                    ${pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent/50"}`}>
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        <div className="flex-1 pb-16 md:pb-0">{children}</div>
      </div>

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
