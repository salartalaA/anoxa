import { Users } from "lucide-react";
import Link from "next/link";

interface RecentSignup {
  handle: string;
  id: string;
  initial: string;
  joinedAt: string;
  username: string;
}

const recentSignups: RecentSignup[] = [
  {
    id: "8cde0320-4f2c-4b9c-aeaa-51bbbe7b3f2b",
    username: "amiramir",
    handle: "@amiramir",
    initial: "A",
    joinedAt: "4h ago",
  },
  {
    id: "b975c9fe-2e22-4b7c-82db-05148ed4b719",
    username: "maker",
    handle: "@baker",
    initial: "M",
    joinedAt: "Jul 13, 2026",
  },
  {
    id: "90ea8c76-f888-4cb5-8a0a-00757d8e8dda",
    username: "testchi",
    handle: "@testchi",
    initial: "T",
    joinedAt: "Jul 9, 2026",
  },
  {
    id: "852a1fe1-995b-4731-987b-65050bd9501f",
    username: "asdasdas",
    handle: "@asdasdasd",
    initial: "A",
    joinedAt: "Jul 8, 2026",
  },
  {
    id: "44e18cd6-5983-432a-af5d-ea03a8e54c73",
    username: "test22",
    handle: "@test22",
    initial: "T",
    joinedAt: "Jul 7, 2026",
  },
];

export default function RecentSignups() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="flex items-center gap-2 font-semibold text-2xl tracking-tight">
          <Users className="h-5 w-5 text-primary" />
          Recent Signups
        </h3>

        <p className="text-muted-foreground text-sm">
          New users who joined recently
        </p>
      </div>

      <div className="p-6 pt-0">
        <div className="flex flex-wrap gap-4">
          {recentSignups.map((user) => (
            <Link
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              href={`/dashboard/users/${user.username}`}
              key={user.id}
            >
              <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                  {user.initial}
                </span>
              </span>

              <div>
                <p className="font-medium text-sm">{user.username}</p>

                <p className="text-muted-foreground text-xs">
                  {user.handle} · {user.joinedAt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
