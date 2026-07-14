"use client";

import { LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileDropDown({
  fullName,
  username,
  avatarURL,
  email,
}: {
  fullName: string;
  username: string;
  avatarURL: string;
  email: string;
}) {
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

        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
