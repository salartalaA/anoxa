"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { PlatformActivity } from "@/actions/admin/dashboard";
import Overview from "@/components/admin/overview";
import PlatformActiviyChart from "@/components/admin/platform-activity-chart";
import RecentActivity from "@/components/admin/recent-activities";
import RecentSignups from "@/components/admin/recent-signups";
import { Button } from "@/components/ui/button";
import type { DashboardStats, SecureUser } from "./page";

export default function Admin({
  stats,
  platformActivity,
  lastSignups,
}: {
  stats: DashboardStats;
  platformActivity: PlatformActivity[];
  lastSignups: SecureUser[];
}) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <main className="p-6">
      <div className="animate-fade-up space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Welcome back!</h1>
            <p className="text-muted-foreground">
              Here's an overview of your platform.
            </p>
          </div>
          <Button
            className="h-10 transition-opacity disabled:opacity-60"
            disabled={isPending}
            onClick={handleRefresh}
            variant="outline"
          >
            <RefreshCw className={isPending ? "animate-spin" : ""} size={20} />
            {isPending ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <Overview stats={stats} />

        <div className="flex gap-6">
          <PlatformActiviyChart platformActivity={platformActivity} />

          <RecentActivity />
        </div>

        <RecentSignups lastSignups={lastSignups} />
      </div>
    </main>
  );
}
