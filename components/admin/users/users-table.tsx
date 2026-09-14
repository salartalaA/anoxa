"use client";

import {
  BadgeCheck,
  Ban,
  Ellipsis,
  Eye,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  banUser,
  suspendUser,
  unbanUser,
  unsuspendUser,
} from "@/actions/admin/manage";
import { changeUserRole } from "@/actions/admin/users";
import type { AllUsers } from "@/app/(admin)/admin/users/page";
import type { Role, Status } from "@/app/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ChangeRoleDialog from "./change-role-dialog";
import DeleteUserDialog from "./delete-user-dialog";
import UserDetailsDialog from "./user-details-dialog";

const getRoleClass = (role: Role) => {
  switch (role) {
    case "ADMIN":
      return "bg-primary/20 text-primary ring-primary/40";

    case "MODERATOR":
      return "bg-primary/10 text-primary ring-primary/30";

    default:
      return "bg-muted text-muted-foreground ring-border";
  }
};

const getStatusClass = (status: Status) => {
  switch (status) {
    case "ACTIVE":
      return "bg-success/10 text-success ring-success/30";

    case "SUSPENDED":
      return "bg-warning/10 text-warning ring-warning/30";

    case "BANNED":
      return "bg-destructive/20 text-red-300 ring-destructive/40";

    default:
      return "bg-muted text-muted-foreground ring-border";
  }
};

interface UsersTableProps {
  banUserPerm: boolean;
  currentUserRole: Role;
  deleteUserPerm: boolean;
  manageRolesPerm: boolean;
  suspendUserPerm: boolean;
  users: AllUsers[];
}

export default function UsersTable({
  users,
  currentUserRole,
  banUserPerm,
  suspendUserPerm,
  manageRolesPerm,
  deleteUserPerm,
}: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<AllUsers | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);

  const canManageTarget = (targetRole: Role) => {
    if (targetRole === "OWNER") {
      return false;
    }

    if (currentUserRole === "OWNER") {
      return true;
    }

    if (currentUserRole === "ADMIN" || currentUserRole === "MODERATOR") {
      return targetRole === "USER";
    }

    return false;
  };

  const handleViewUser = (user: AllUsers) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const handleChangeRole = (user: AllUsers) => {
    setSelectedUser(user);
    setChangeRoleOpen(true);
  };

  const handleDeleteUser = (user: AllUsers) => {
    setSelectedUser(user);

    setDeleteUserOpen(true);
  };

  const handleDetailsOpenChange = (open: boolean) => {
    setDetailsOpen(open);

    if (!open) {
      setSelectedUser(null);
    }
  };

  const handleChangeRoleOpenChange = (open: boolean) => {
    setChangeRoleOpen(open);

    if (!open) {
      setSelectedUser(null);
    }
  };

  const handleDeleteUserOpenChange = (open: boolean) => {
    setDeleteUserOpen(open);

    if (!open) {
      setSelectedUser(null);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    await suspendUser(userId);
  };

  const handleReinstateUser = async (userId: string) => {
    await unsuspendUser(userId);
  };

  const handleBanUser = async (userId: string) => {
    await banUser(userId);
  };

  const handleUnbanUser = async (userId: string) => {
    await unbanUser(userId);
  };

  const handleChangeVerify = async (userId: string) => {
    await changeUserRole(userId);
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">User</TableHead>

              <TableHead>Username</TableHead>

              <TableHead className="hidden md:table-cell">Email</TableHead>

              <TableHead>Role</TableHead>

              <TableHead>Status</TableHead>

              <TableHead className="hidden lg:table-cell">Joined</TableHead>

              <TableHead className="w-12 pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => {
              const joinedDate = new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
              }).format(user.createdAt);

              const canManageUser = canManageTarget(user.role);

              return (
                <TableRow className="group hover:bg-muted/50" key={user.id}>
                  {/* User */}
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                        {user.avatarURL ? (
                          <Image
                            alt={`${user.fullName} profile`}
                            className="rounded-full object-cover"
                            fill
                            sizes="32px"
                            src={user.avatarURL}
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs">
                            {user.fullName.charAt(0)}
                          </span>
                        )}
                      </span>

                      <span className="font-medium text-foreground">
                        {user.fullName}
                      </span>

                      {user.isVerified && (
                        <BadgeCheck className="-ml-2 text-primary" size={16} />
                      )}
                    </div>
                  </TableCell>

                  {/* Username */}
                  <TableCell className="text-muted-foreground">
                    @{user.username}
                  </TableCell>

                  {/* Email */}
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {user.email}
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-[11px] uppercase tracking-wide ring-1 ring-inset ${getRoleClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-[11px] uppercase tracking-wide ring-1 ring-inset ${getStatusClass(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </TableCell>

                  {/* Joined */}
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {joinedDate}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="pr-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            className="h-8 w-8 opacity-60 group-hover:opacity-100"
                            size="icon"
                            variant="ghost"
                          >
                            <Ellipsis className="h-4 w-4" />

                            <span className="sr-only">Open actions</span>
                          </Button>
                        }
                      />

                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>

                          {/* View */}
                          <DropdownMenuItem
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>

                          {/* Suspend / Reinstate */}
                          {suspendUserPerm && canManageUser && (
                            <>
                              <DropdownMenuSeparator />

                              {user.status === "ACTIVE" && (
                                <DropdownMenuItem
                                  onClick={() => handleSuspendUser(user.id)}
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  Suspend
                                </DropdownMenuItem>
                              )}

                              {user.status === "SUSPENDED" && (
                                <DropdownMenuItem
                                  onClick={() => handleReinstateUser(user.id)}
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Reinstate
                                </DropdownMenuItem>
                              )}

                              {user.status === "BANNED" && (
                                <DropdownMenuItem disabled>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Suspend
                                </DropdownMenuItem>
                              )}
                            </>
                          )}

                          {/* Ban / Unban */}
                          {banUserPerm && canManageUser && (
                            <>
                              {user.status !== "BANNED" && (
                                <DropdownMenuItem
                                  className="text-amber-400 focus:text-amber-300"
                                  onClick={() => handleBanUser(user.id)}
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Ban
                                </DropdownMenuItem>
                              )}

                              {user.status === "BANNED" && (
                                <DropdownMenuItem
                                  onClick={() => handleUnbanUser(user.id)}
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Unban
                                </DropdownMenuItem>
                              )}
                            </>
                          )}

                          {/* Change Role */}
                          {manageRolesPerm && canManageUser && (
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(user)}
                            >
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                          )}

                          {currentUserRole === "OWNER" && (
                            <DropdownMenuItem
                              onClick={() => handleChangeVerify(user.id)}
                            >
                              <BadgeCheck className="mr-2 h-4 w-4 text-primary" />
                              Change Verify
                            </DropdownMenuItem>
                          )}

                          {/* Delete */}
                          {deleteUserPerm && canManageUser && (
                            <>
                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                className="text-red-400 focus:text-red-300"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* User Details */}
      <UserDetailsDialog
        onOpenChange={handleDetailsOpenChange}
        open={detailsOpen}
        user={selectedUser}
      />

      {/* Change Role */}
      <ChangeRoleDialog
        currentRole={selectedUser?.role ?? "USER"}
        fullname={selectedUser?.fullName ?? ""}
        onOpenChange={handleChangeRoleOpenChange}
        open={changeRoleOpen}
        userId={selectedUser?.id ?? ""}
      />

      {/* Delete User */}
      <DeleteUserDialog
        fullname={selectedUser?.fullName ?? ""}
        onOpenChange={handleDeleteUserOpenChange}
        open={deleteUserOpen}
        userId={selectedUser?.id ?? ""}
      />
    </>
  );
}
