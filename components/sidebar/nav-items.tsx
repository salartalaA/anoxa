"use client";

import { Bookmark, MessageCircle, Rss } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NavItems() {
  const pathname = usePathname();

  return (
    <>
      <Link
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors",
          pathname === "/"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/"
        prefetch
      >
        <Rss size={20} />
        Feed
      </Link>

      <Link
        className={cn(
          "mt-1 flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors",
          pathname === "/bookmarks"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/bookmarks"
        prefetch
      >
        <Bookmark size={20} />
        Bookmarks
      </Link>

      <Link
        className={cn(
          "mt-1 flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors",
          pathname === "/messages"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/messages"
        prefetch
      >
        <MessageCircle size={20} />
        Messages
      </Link>
    </>
  );
}
