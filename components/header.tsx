import { ActivityIcon, Shield } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/actions/auth";
import { getNotification } from "@/actions/notification";
import type { User } from "@/app/generated/prisma/client";
import NotificationDropDown from "./notification/notification-dropdown";
import ProfileDropDown from "./profile/profile-dropdown";
import NavItems from "./sidebar/nav-items";

export default async function Header() {
  const user = (await getCurrentUser()) as User;

  const notification = await getNotification();

  const semiPerm = user.role !== "USER";

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <div className="flex h-16 items-center gap-2 lg:hidden">
          <Link className="flex items-center" href="/">
            <div className="flex w-full items-center gap-2">
              <span className="rounded-lg bg-blue-400 p-1 transition-transform duration-300 hover:scale-110">
                <ActivityIcon className="text-violet-800 max-md:size-5" />
              </span>
              <span className="font-semibold text-sm tracking-tight md:text-lg">
                <span className="text-white">AN</span>
                <span className="text-primary">OXA</span>
              </span>
            </div>
          </Link>
          {semiPerm && (
            <Link href="/admin" prefetch>
              <Shield size={20} />
            </Link>
          )}
        </div>

        <div className="mx-auto flex w-full items-center justify-center lg:hidden">
          <NavItems />
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <NotificationDropDown notification={notification} />
          <ProfileDropDown
            avatarURL={user.avatarURL ?? ""}
            email={user.email}
            fullName={user.fullName}
            role={user.role}
            username={user.username}
          />
        </div>
      </div>
    </header>
  );
}
