import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarFooter } from "@/components/ui/sidebar";

import { BarChart, Activity, TrendingUp, BrainCircuit, Menu, MessageSquare, Plus, ChartSpline } from "lucide-react";
import Link from "next/link";
import React from "react";
import { AccountSelector } from "@/components/dashboard/AccountSelector";
import { getAccounts } from "@/lib/actions/accounts";
import { checkUser } from "@/lib/checkUser";
import { AccountDialog } from "@/components/dashboard/AccountDialog";

const DashboardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const accounts = await getAccounts();
  const user = await checkUser();
  const currentAccountId = user?.id ?? "";

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar className="border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ChartSpline className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold tracking-tight">TradeSync</h2>
            </div>
          </SidebarHeader>
          <SidebarContent className="space-y-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent/50">
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/trades" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent/50">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span>Trades</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/analytics" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent/50">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/insights" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent/50">
                    <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                    <span>Insights</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="space-y-4 px-3 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Current Account</p>
                <AccountSelector accounts={accounts} currentAccountId={currentAccountId} />
              </div>
              <AccountDialog />
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4">
              <SidebarTrigger className="lg:hidden">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <div className="flex items-center gap-4">
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Trade
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ask AI
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 space-y-4 p-4 md:p-6 pt-2">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
