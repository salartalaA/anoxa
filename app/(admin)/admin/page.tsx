import { redirect } from "next/navigation";
import { requireActiveUser } from "@/actions/auth";
import Admin from "@/app/(admin)/admin/_admin";
import AdminMainHeader from "@/components/sidebar/admin/admin-main-header";

export default async function AdminPage() {
  const currentUser = (await requireActiveUser()).user;

  if (!currentUser) {
    return redirect("/login");
  }

  if (currentUser.role === "USER") {
    return redirect("/");
  }

  return (
    <>
      <AdminMainHeader
        description="Overview of platform activity and key metrics."
        title="Dashboard"
      />

      <Admin />
    </>
  );
}
