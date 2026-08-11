import { Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityItem {
  action: string;
  color: string;
  initials: string;
  name: string;
  target: string;
  time: string;
}

const activities: ActivityItem[] = [
  {
    initials: "AM",
    name: "Alex Mercer",
    action: "suspended user",
    target: "Emily Stone",
    time: "28 minutes ago",
    color: "bg-orange-500/20 text-orange-300",
  },
  {
    initials: "SC",
    name: "Sarah Chen",
    action: "deleted comment",
    target: "Comment #182",
    time: "43 minutes ago",
    color: "bg-amber-500/20 text-amber-300",
  },
  {
    initials: "AM",
    name: "Alex Mercer",
    action: "banned user",
    target: "Olivia Brooks",
    time: "about 1 hour ago",
    color: "bg-orange-500/20 text-orange-300",
  },
  {
    initials: "SC",
    name: "Sarah Chen",
    action: "resolved report",
    target: "Report #r-4",
    time: "about 2 hours ago",
    color: "bg-amber-500/20 text-amber-300",
  },
  {
    initials: "DW",
    name: "Dana Whitfield",
    action: "changed user's role",
    target: "Marcus Reid → moderator",
    time: "about 2 hours ago",
    color: "bg-blue-500/20 text-blue-300",
  },
  {
    initials: "AM",
    name: "Alex Mercer",
    action: "deleted post",
    target: "Post #p-99",
    time: "about 3 hours ago",
    color: "bg-orange-500/20 text-orange-300",
  },
  {
    initials: "DW",
    name: "Dana Whitfield",
    action: "verified user",
    target: "James Anderson",
    time: "about 4 hours ago",
    color: "bg-blue-500/20 text-blue-300",
  },
  {
    initials: "SC",
    name: "Sarah Chen",
    action: "approved report",
    target: "Report #r-7",
    time: "about 5 hours ago",
    color: "bg-amber-500/20 text-amber-300",
  },
  {
    initials: "AM",
    name: "Alex Mercer",
    action: "deleted post",
    target: "Post #p-104",
    time: "about 6 hours ago",
    color: "bg-orange-500/20 text-orange-300",
  },
  {
    initials: "DW",
    name: "Dana Whitfield",
    action: "changed user's role",
    target: "Sophie Williams → moderator",
    time: "about 7 hours ago",
    color: "bg-blue-500/20 text-blue-300",
  },
  {
    initials: "SC",
    name: "Sarah Chen",
    action: "suspended user",
    target: "Daniel Carter",
    time: "about 8 hours ago",
    color: "bg-amber-500/20 text-amber-300",
  },
  {
    initials: "AM",
    name: "Alex Mercer",
    action: "resolved report",
    target: "Report #r-9",
    time: "about 9 hours ago",
    color: "bg-orange-500/20 text-orange-300",
  },
  {
    initials: "DW",
    name: "Dana Whitfield",
    action: "banned user",
    target: "Michael Thompson",
    time: "about 10 hours ago",
    color: "bg-blue-500/20 text-blue-300",
  },
  {
    initials: "SC",
    name: "Sarah Chen",
    action: "deleted comment",
    target: "Comment #207",
    time: "about 11 hours ago",
    color: "bg-amber-500/20 text-amber-300",
  },
  {
    initials: "AM",
    name: "Alex Mercer",
    action: "verified user",
    target: "Emma Johnson",
    time: "about 12 hours ago",
    color: "bg-orange-500/20 text-orange-300",
  },
];

export default function RecentActivity() {
  return (
    <div className="w-1/2 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="m-6 flex items-center justify-between">
        <div className="flex flex-col space-y-1.5">
          <h3 className="flex items-center gap-2 font-semibold text-2xl leading-none tracking-tight">
            <Activity className="text-primary" size={20} />
            Recent Activity
          </h3>
          <p className="text-muted-foreground text-sm">
            Latest actions on the platform
          </p>
        </div>

        <Link
          className="flex items-center gap-1 font-medium text-primary text-xs"
          href="/admin/audit-logs"
        >
          View all logs
          <ArrowRight size={12} />
        </Link>
      </div>

      <div className="p-6 pt-0">
        <div className="divide-y divide-border">
          <ScrollArea className="h-[320px]">
            {activities.map((item) => (
              <div
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40"
                key={`${item.name}-${item.action}-${item.target}`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-semibold text-[10px] tracking-wide ring-1 ring-border ${item.color}`}
                >
                  {item.initials}
                </div>

                <div className="min-w-0 flex-1 text-sm">
                  <span className="font-medium text-foreground">
                    {item.name}
                  </span>{" "}
                  <span className="text-muted-foreground">{item.action}</span>{" "}
                  <span className="font-medium text-foreground">
                    {item.target}
                  </span>
                </div>

                <span className="shrink-0 text-muted-foreground text-xs">
                  {item.time}
                </span>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
