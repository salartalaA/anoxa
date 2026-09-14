"use client";

import { LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/actions/auth";
import type { Role } from "@/app/generated/prisma/enums";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { socket } from "@/lib/socket";

export default function ProfileDropDown({
  fullName,
  username,
  avatarURL,
  email,
  role,
}: {
  fullName: string;
  username: string;
  avatarURL: string;
  email: string;
  role: Role;
}) {
  const router = useRouter();

  const handleSignout = async () => {
    socket.disconnect();

    await logout();

    toast.success("Signed out successfully.", {
      position: "top-right",
      className: "bg-card! text-primary!",
      closeButton: true,
    });

    router.push("/auth/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        render={
          <div className="flex items-center gap-x-3">
            <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
              {avatarURL ? (
                <Image
                  alt="user profile"
                  className="rounded-full object-cover"
                  fill
                  src={avatarURL}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs">
                  {fullName.charAt(0)}
                </span>
              )}
            </span>

            <div className="hidden flex-col items-start md:flex">
              <span className="font-medium text-sm leading-none">
                {fullName}
              </span>
            </div>
          </div>
        }
      />

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm">{fullName}</p>
            <p className="text-muted-foreground text-xs">{email}</p>
            {role !== "USER" && (
              <p className="mt-1 text-muted-foreground text-xs">
                <span>{role}</span>
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              className="flex w-full items-center"
              href={`/profile/${username}`}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleSignout}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
