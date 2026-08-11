import { redirect } from "next/navigation";
import { requireActiveUser } from "@/actions/auth";
import AdminMainHeader from "@/components/sidebar/admin/admin-main-header";

export default async function ReportedPostsPage() {
  const currentUser = (await requireActiveUser()).user;

  if (!currentUser) {
    return redirect("/login");
  }

  if (currentUser.role === "USER") {
    return redirect("/");
  }

  return (
    <AdminMainHeader
      description="Review and moderate user-generated posts."
      title="Posts"
    />
  );
}
