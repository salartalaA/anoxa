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
        // className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sidebar-foreground text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors",
          pathname === "/"
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        href="/"
      >
        <Rss size={20} />
        Feed
      </Link>

      <Link
        className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sidebar-foreground text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        href="/bookmarks"
      >
        <Bookmark size={20} />
        Bookmarks
      </Link>
    </>
  );
}
