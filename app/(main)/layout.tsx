import { ActivityIcon, Shield } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { LogoutButton } from "@/components/sidebar/logout-button";
import NavItems from "@/components/sidebar/nav-items";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/register");
  }

  const semiPerm = user.role !== "USER";

  return (
    <>
      <aside className="fixed top-0 left-0 z-40 h-screen w-64 border-r bg-sidebar-background transition-all duration-300">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link className="flex items-center" href="/">
              <div className="flex w-full items-center gap-2">
                <span className="rounded-lg bg-blue-400 p-1 transition-transform duration-300 hover:scale-110">
                  <ActivityIcon className="text-violet-800" />
                </span>
                <span className="font-semibold text-lg tracking-tight">
                  <span className="text-white">AN</span>
                  <span className="text-primary">OXA</span>
                </span>
              </div>
            </Link>
            {semiPerm && (
              <Link href="/admin" prefetch>
                <Shield size={20} />
              </Link>
            )}
          </div>

          <div className="relative flex-1 overflow-hidden py-4">
            <nav className="space-y-1 px-2">
              <div className="mb-4">
                <span className="px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Social
                </span>

                <NavItems />
              </div>
            </nav>
          </div>
          <div className="border-t p-4">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="pl-64">{children}</div>
    </>
  );
}
