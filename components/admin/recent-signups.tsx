import { Users } from "lucide-react";
import Image from "next/image";
import type { SecureUser } from "@/app/(admin)/admin/page";

export default function RecentSignups({
  lastSignups,
}: {
  lastSignups: SecureUser[];
}) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="flex items-center gap-2 font-bold tracking-tight sm:text-2xl md:text-3xl">
          <Users className="h-5 w-5 text-primary" />
          Recent Signups
        </h3>

        <p className="text-muted-foreground text-xs md:text-sm">
          New users who joined recently
        </p>
      </div>

      <div className="p-6 pt-0">
        <div className="flex flex-wrap gap-4">
          {lastSignups.map((user) => {
            const joinedDate = new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(user.createdAt);

            return (
              <a
                className="flex w-full items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 sm:w-fit"
                href={`/profile/${user.username}`}
                key={user.id}
                rel="noreferrer"
                target="_blank"
              >
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

                <div>
                  <p className="font-medium text-sm">{user.username}</p>

                  <p className="text-muted-foreground text-xs">
                    {user.username} · {joinedDate}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
