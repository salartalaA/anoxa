"use client";

import Image from "next/image";
import type { AllUsers } from "@/app/(admin)/admin/users/page";
import type { Role, Status } from "@/app/generated/prisma/enums";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface UserDetailsDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  user: AllUsers | null;
}

export default function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  if (!user) {
    return null;
  }

  const joinedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(user.createdAt);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>

          <DialogDescription>
            Profile and account information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
              {user.avatarURL ? (
                <Image
                  alt={`${user.fullName}'s profile`}
                  className="object-cover"
                  fill
                  sizes="44px"
                  src={user.avatarURL}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted font-semibold text-sm">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <p className="font-semibold text-base text-foreground">
                {user.fullName}
              </p>

              <p className="text-muted-foreground text-sm">@{user.username}</p>
            </div>
          </div>

          {/* Details */}
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {/* Email */}
            <div>
              <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                Email
              </dt>

              <dd className="mt-0.5 truncate text-foreground">{user.email}</dd>
            </div>

            {/* Joined */}
            <div>
              <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                Joined
              </dt>

              <dd className="mt-0.5 text-foreground">{joinedDate}</dd>
            </div>

            {/* Role */}
            <div>
              <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                Role
              </dt>

              <dd className="mt-1">
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-[11px] uppercase tracking-wide ring-1 ring-inset ${getRoleClass(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </dd>
            </div>

            {/* Status */}
            <div>
              <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                Status
              </dt>

              <dd className="mt-1">
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-[11px] uppercase tracking-wide ring-1 ring-inset ${getStatusClass(
                    user.status
                  )}`}
                >
                  {user.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
}
