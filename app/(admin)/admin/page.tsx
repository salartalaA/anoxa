import { redirect } from "next/navigation";
import { dashboardStats } from "@/actions/admin/overview";
import { requireActiveUser } from "@/actions/auth";
import Admin from "@/app/(admin)/admin/_admin";
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

export default async function AdminPage() {
  const currentUser = (await requireActiveUser()).user;

  if (!currentUser) {
    return redirect("/auth/login");
  }

  if (currentUser.role === "USER") {
    return redirect("/");
  }

  const stats = await dashboardStats();

  return (
    <>
      <AdminMainHeader
        description="Overview of platform activity and key metrics."
        title="Dashboard"
      />

      <Admin stats={stats} />
    </>
  );
}
