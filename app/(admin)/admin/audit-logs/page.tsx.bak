import { redirect } from "next/navigation";
import { requireActiveUser } from "@/actions/auth";
import AdminMainHeader from "@/components/sidebar/admin/admin-main-header";

export default async function AuditLogsPage() {
  const currentUser = (await requireActiveUser()).user;

  if (!currentUser) {
    return redirect("/auth/login");
  }

  if (currentUser.role === "USER") {
    return redirect("/");
  }

  return (
    <AdminMainHeader
      description="Immutable record of every administrative action."
      title="Audit Logs"
    />
  );
}
