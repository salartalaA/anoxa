"use client";

import { RefreshCw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { Role, Status } from "@/app/generated/prisma/enums";
import UsersTable from "@/components/admin/users/users-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AllUsers } from "./page";

type Filter =
  | "ALL"
  | "ACTIVE"
  | "SUSPENDED"
  | "BANNED"
  | "USER"
  | "MODERATOR"
  | "ADMIN";

export default function Users({
  users,
  suspendUserPerm,
  banUserPerm,
  manageRolesPerm,
  deleteUserPerm,
  currentUserRole,
}: {
  users: AllUsers[];
  banUserPerm: boolean;
  suspendUserPerm: boolean;
  manageRolesPerm: boolean;
  deleteUserPerm: boolean;
  currentUserRole: Role;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        normalizedSearch === "" ||
        user.username.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch);

      const matchesFilter =
        filter === "ALL" ||
        user.status === (filter as Status) ||
        user.role === (filter as Role);

      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  const getButtonClass = (buttonFilter: Filter) => {
    if (filter === buttonFilter) {
      return "rounded-md bg-primary px-3 font-medium text-primary-foreground text-xs transition-colors";
    }

    return "rounded-md bg-muted/50 px-3 py-1 font-medium text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground";
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="flex flex-col space-y-4 p-6 pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-semibold text-base tracking-tight">Users</h3>

            <div className="relative w-full sm:max-w-xs">
              <Search
                className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
                size={16}
              />

              <Input
                className="px-3 py-1 pl-9"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by username or email"
                type="text"
                value={search}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              <Button
                className={getButtonClass("ALL")}
                onClick={() => setFilter("ALL")}
                type="button"
              >
                All
              </Button>

              <Button
                className={getButtonClass("ACTIVE")}
                onClick={() => setFilter("ACTIVE")}
                type="button"
              >
                Active
              </Button>

              <Button
                className={getButtonClass("SUSPENDED")}
                onClick={() => setFilter("SUSPENDED")}
                type="button"
              >
                Suspended
              </Button>

              <Button
                className={getButtonClass("BANNED")}
                onClick={() => setFilter("BANNED")}
                type="button"
              >
                Banned
              </Button>

              <Button
                className={getButtonClass("USER")}
                onClick={() => setFilter("USER")}
                type="button"
              >
                User
              </Button>

              <Button
                className={getButtonClass("MODERATOR")}
                onClick={() => setFilter("MODERATOR")}
                type="button"
              >
                Moderator
              </Button>

              <Button
                className={getButtonClass("ADMIN")}
                onClick={() => setFilter("ADMIN")}
                type="button"
              >
                Admin
              </Button>
            </div>

            <Button
              className="h-10 transition-opacity disabled:opacity-60"
              disabled={isPending}
              onClick={handleRefresh}
              variant="outline"
            >
              <RefreshCw
                className={isPending ? "animate-spin" : ""}
                size={20}
              />
              {isPending ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {filteredUsers.length > 0 ? (
          <UsersTable
            banUserPerm={banUserPerm}
            currentUserRole={currentUserRole}
            deleteUserPerm={deleteUserPerm}
            manageRolesPerm={manageRolesPerm}
            suspendUserPerm={suspendUserPerm}
            users={filteredUsers}
          />
        ) : (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>

            <h3 className="font-semibold text-foreground text-sm">
              No users found
            </h3>

            {(search.trim() || filter !== "ALL") && (
              <Button
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setFilter("ALL");
                }}
                size="sm"
                variant="outline"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
