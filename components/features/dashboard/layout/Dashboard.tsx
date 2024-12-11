"use client";

import { DashboardHeader } from "./DashboardHeader";
import { DashboardShell } from "./DashboardShell";
import { DashboardContent } from "./DashboardContent";

export default function Dashboard() {
  return (
    <DashboardShell>
      <DashboardHeader />
      <DashboardContent trades={[]} recentTrades={[]} performance={[]} />
    </DashboardShell>
  );
}
