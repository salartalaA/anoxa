import { getCurrentUser } from "@/actions/auth";
import type { User } from "@/app/generated/prisma/client";
import ProfileDropDown from "./profile/profile-dropdown";

export default async function Header() {
  const user = (await getCurrentUser()) as User;

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <div className="flex flex-1 items-center justify-end gap-3">
          <ProfileDropDown
            avatarURL={user.avatarURL ?? ""}
            email={user.email}
            fullName={user.fullName}
            username={user.username}
          />
        </div>
      </div>
    </header>
  );
}
