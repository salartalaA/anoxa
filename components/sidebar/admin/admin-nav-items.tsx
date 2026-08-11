"use client";

import {
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
          "flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors",
          pathname === "/admin"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/admin"
        prefetch
      >
        <LayoutDashboard size={20} />
        Dashboard
      </Link>

      <Link
        className={cn(
          "mt-1 flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors",
          pathname === "/admin/users"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/admin/users"
        prefetch
      >
        <Users size={20} />
        Users
      </Link>

      <Link
        className={cn(
          "mt-1 flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors",
          pathname === "/admin/comments"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/admin/comments"
        prefetch
      >
        <MessageSquare size={20} />
        Messages
      </Link>

      <Link
        className={cn(
          "mt-1 flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors",
          pathname === "/admin/audit-logs"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/admin/audit-logs"
        prefetch
      >
        <ScrollText size={20} />
        Audit Logs
      </Link>
    </>
  );
}
