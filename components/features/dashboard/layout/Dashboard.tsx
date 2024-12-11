"use client";

import { DashboardHeader } from "@/components/features/dashboard/layout/DashboardHeader";
import { DashboardShell } from "@/components/features/dashboard/layout/DashboardShell";
import { DashboardContent } from "@/components/features/dashboard/layout/DashboardContent";

export default function Dashboard() {
  return (
    <DashboardShell>
      <DashboardHeader />
      <DashboardContent />
    </DashboardShell>
  );
}
