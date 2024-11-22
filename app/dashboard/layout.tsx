import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { BarChart, Activity, TrendingUp, BrainCircuit, Menu, MessageSquare } from "lucide-react";
import Link from "next/link";
import React from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <Sidebar>
            <SidebarHeader>
              <h2 className="text-xl font-bold px-4 py-2">Trade Tracker</h2>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <Link href="/dashboard">
                      <BarChart className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/trades">
                      <Activity className="mr-2 h-4 w-4" />
                      Trades
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/analytics">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Analytics
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/insights">
                      <BrainCircuit className="mr-2 h-4 w-4" />
                      Insights
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <div className="flex-1 overflow-auto">
            <header className=" shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <SidebarTrigger>
                  <Menu className="h-6 w-6" />
                </SidebarTrigger>
                <h1 className="text-2xl font-semibold">Trading Dashboard</h1>
                <Button>New Trade</Button>{" "}
                <Button variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ask AI
                </Button>
              </div>
            </header>

            {children}
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;
