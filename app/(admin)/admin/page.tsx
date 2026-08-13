import { redirect } from "next/navigation";
import {
  dashboardStats,
  getPlatformActivity,
  recentSignups,
} from "@/actions/admin/dashboard";
import { requireActiveUser } from "@/actions/auth";
import Admin from "@/app/(admin)/admin/_admin";
import type { User } from "@/app/generated/prisma/client";
import AdminMainHeader from "@/components/sidebar/admin/admin-main-header";

export interface DashboardStats {
  activeUsers: number;
  bannedUsers: number;
  pendingReports: number;
  suspendedUsers: number;
  totalComments: number;
  totalPosts: number;
  totalUsers: number;
  verifiesUsers: number;
}

export type SecureUser = Omit<User, "password">;

export default async function AdminPage() {
  const currentUser = (await requireActiveUser()).user;

  if (!currentUser) {
    return redirect("/auth/login");
  }

  if (currentUser.role === "USER") {
    return redirect("/");
  }

  const stats = await dashboardStats();

  const platformActivity = await getPlatformActivity();

  const lastSignups = (await recentSignups()) as SecureUser[];

  return (
    <>
      <AdminMainHeader
        description="Overview of platform activity and key metrics."
        title="Dashboard"
      />

      <Admin
        lastSignups={lastSignups}
        platformActivity={platformActivity}
        stats={stats}
      />
    </>
  );
}
