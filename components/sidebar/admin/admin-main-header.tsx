import { House } from "lucide-react";
import Link from "next/link";
import AdminNavItems from "./admin-nav-items";

export default function AdminMainHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-border border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-semibold text-foreground text-lg">
          {title}
        </h1>
        <p className="hidden truncate text-muted-foreground text-xs sm:block">
          {description}
        </p>
      </div>

      <div className="flex items-center lg:hidden">
        <AdminNavItems />
        <Link className="px-2.5 lg:hidden" href="/" prefetch>
          <House size={20} />
        </Link>
      </div>
    </header>
  );
}
