"use client";

import {
  FileText,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminNavItems() {
  const pathname = usePathname();

  return (
    <>
      <Link
        className={cn(
          "flex items-center justify-center gap-2.5 rounded-lg px-2.5 py-2 font-medium text-sm transition-colors md:justify-start md:gap-3 md:px-3",
          pathname === "/admin"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/admin"
        prefetch
      >
        <LayoutDashboard className="size-[18px] md:size-5" />
        <span className="hidden lg:inline">Dashboard</span>
      </Link>

      <Link
        className={cn(
          "flex items-center justify-center gap-2.5 rounded-lg px-2.5 py-2 font-medium text-sm transition-colors md:mt-1 md:justify-start md:gap-3 md:px-3",
          pathname === "/admin/users"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/admin/users"
        prefetch
      >
        <Users className="size-[18px] md:size-5" />
        <span className="hidden lg:inline">Users</span>
      </Link>

      <Link
        className={cn(
          "flex items-center justify-center gap-2.5 rounded-lg px-2.5 py-2 font-medium text-sm transition-colors md:mt-1 md:justify-start md:gap-3 md:px-3",
          pathname === "/admin/posts"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/admin/posts"
        prefetch
      >
        <FileText className="size-[18px] md:size-5" />
        <span className="hidden lg:inline">Posts</span>
      </Link>

      <Link
        className={cn(
          "flex items-center justify-center gap-2.5 rounded-lg px-2.5 py-2 font-medium text-sm transition-colors md:mt-1 md:justify-start md:gap-3 md:px-3",
          pathname === "/admin/comments"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/admin/comments"
        prefetch
      >
        <MessageSquare className="size-[18px] md:size-5" />
        <span className="hidden lg:inline">Comments</span>
      </Link>

      <Link
        className={cn(
          "flex items-center justify-center gap-2.5 rounded-lg px-2.5 py-2 font-medium text-sm transition-colors md:mt-1 md:justify-start md:gap-3 md:px-3",
          pathname === "/admin/audit-logs"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/admin/audit-logs"
        prefetch
      >
        <ScrollText className="size-[18px] md:size-5" />
        <span className="hidden lg:inline">Audit Logs</span>
      </Link>
    </>
  );
}
