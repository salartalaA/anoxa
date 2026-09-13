"use client";

import { Bookmark, Rss } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NavItems() {
  const pathname = usePathname();

  return (
    <>
      <Link
        className={cn(
          "flex items-center justify-center gap-2.5 rounded-lg px-2.5 py-2 font-medium text-sm transition-colors md:justify-start md:gap-3 md:px-3",
          pathname === "/"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/"
        prefetch
      >
        <Rss className="size-[18px] md:size-5" />
        <span className="hidden md:inline">Feed</span>
      </Link>

      <Link
        className={cn(
          "flex items-center justify-center gap-2.5 rounded-lg px-2.5 py-2 font-medium text-sm transition-colors md:mt-1 md:justify-start md:gap-3 md:px-3",
          pathname === "/bookmarks"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/bookmarks"
        prefetch
      >
        <Bookmark className="size-[18px] md:size-5" />
        <span className="hidden md:inline">Bookmarks</span>
      </Link>
      {/* 
      <Link
        className={cn(
          "flex items-center justify-center gap-2.5 rounded-lg px-2.5 py-2 font-medium text-sm transition-colors md:mt-1 md:justify-start md:gap-3 md:px-3",
          pathname === "/messages"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/messages"
        prefetch
      >
        <MessageCircle className="size-[18px] md:size-5" />
        <span className="hidden md:inline">Messages</span>
      </Link> */}
    </>
  );
}
