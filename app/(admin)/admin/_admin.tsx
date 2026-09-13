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
            <h1 className="font-bold text-xl tracking-tight sm:text-2xl md:text-3xl">
              Welcome back!
            </h1>
            <p className="mt-1 text-muted-foreground text-xs sm:text-sm md:text-base">
              Here's an overview of your platform.
            </p>
          </div>
          <Button
            className="h-10 text-sm transition-opacity disabled:opacity-60 md:text-base"
            disabled={isPending}
            onClick={handleRefresh}
            variant="outline"
          >
            <RefreshCw className={isPending ? "animate-spin" : ""} size={20} />
            {isPending ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <Overview stats={stats} />

        <div className="flex flex-col gap-6 xl:flex-row">
          <PlatformActiviyChart platformActivity={platformActivity} />

          <RecentActivity />
        </div>

        <RecentSignups lastSignups={lastSignups} />
      </div>
    </main>
  );
}
