import { Activity, BarChart, TrendingUp, BrainCircuit } from "lucide-react";

import { getAccounts } from "@/lib/actions/accounts";
import { AccountDialog } from "@/components/features/dashboard/account/AccountDialog";
import { AccountSelector } from "@/components/features/dashboard/account/AccountSelector";
import { DashboardNav } from "@/components/features/dashboard/layout/DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const accounts = await getAccounts();

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
          <div className="flex-1 flex flex-col pt-20 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between flex-shrink-0 px-4">
              <span className="text-xl font-semibold">Dashboard</span>
              <AccountDialog />
            </div>
            <div className="px-4 mt-4">
              <AccountSelector accounts={accounts} currentAccountId={accounts[0]?.id} />
            </div>
            <DashboardNav items={dashboardItems} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        <div className="flex-1 pb-16 md:pb-0">{children}</div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-lg md:hidden">
        <DashboardNav items={dashboardItems} mobile />
      </div>
    </div>
  );
}
