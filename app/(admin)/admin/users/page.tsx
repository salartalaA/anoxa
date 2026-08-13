import { redirect } from "next/navigation";
import { hasPermission } from "@/actions/admin/role";
import { getAllUsers, requireActiveUser } from "@/actions/auth";
import type { Role, Status } from "@/app/generated/prisma/enums";
import AdminMainHeader from "@/components/sidebar/admin/admin-main-header";
import Users from "./_users";

export interface AllUsers {
  avatarURL: string | null;
  bio: string | null;
  createdAt: Date;
  email: string;
  fullName: string;
  id: string;
  isVerified: boolean;
  lastSeen: Date | null;
  role: Role;
  status: Status;
  updatedAt: Date;
  username: string;
}

export default async function UsersPage() {
  const currentUser = (await requireActiveUser()).user;

  if (!currentUser) {
    return redirect("/auth/login");
  }

  if (currentUser.role === "USER") {
    return redirect("/");
  }

  const users = (await getAllUsers()) as AllUsers[];

  const deleteUserPerm = await hasPermission("DELETE_USER");

  const suspendUserPerm = await hasPermission("SUSPEND_USER");

  const banUserPerm = await hasPermission("BAN_USER");

  const manageRolesPerm = await hasPermission("MANAGE_ROLES");

  return (
    <>
      <AdminMainHeader
        description="Manage user accounts, roles, and status."
        title="Users"
      />

      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="animate-fade-in">
          <Users
            banUserPerm={banUserPerm}
            currentUserRole={currentUser.role}
            deleteUserPerm={deleteUserPerm}
            manageRolesPerm={manageRolesPerm}
            suspendUserPerm={suspendUserPerm}
            users={users}
          />
        </div>
      </main>
    </>
  );
}
