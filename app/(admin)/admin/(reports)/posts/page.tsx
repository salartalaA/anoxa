import { Search } from "lucide-react";
import { redirect } from "next/navigation";
import { requireActiveUser } from "@/actions/auth";
import PostsTable from "@/components/admin/posts/posts-table";
import AdminMainHeader from "@/components/sidebar/admin/admin-main-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function ReportedPostsPage() {
  const currentUser = (await requireActiveUser()).user;

  if (!currentUser) {
    return redirect("/auth/login");
  }

  if (currentUser.role === "USER") {
    return redirect("/");
  }

  return (
    <>
      <AdminMainHeader
        description="Review and moderate user-generated posts."
        title="Posts"
      />

      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="animate-fade-in">
          <div className="space-y-4">
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="flex flex-col space-y-4 p-6 pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-semibold text-base tracking-tight">
                    Posts
                  </h3>

                  <div className="relative w-full sm:max-w-xs">
                    <Search
                      className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />

                    <Input
                      className="px-3 py-1 pl-9"
                      placeholder="Search by posts or author"
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Button className="rounded-md bg-primary px-3 font-medium text-primary-foreground text-xs transition-colors">
                    All
                  </Button>
                  <Button className="rounded-md bg-muted/50 px-3 py-1 font-medium text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground">
                    Pending
                  </Button>
                  <Button className="rounded-md bg-muted/50 px-3 py-1 font-medium text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground">
                    Under Review
                  </Button>
                  <Button className="rounded-md bg-muted/50 px-3 py-1 font-medium text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground">
                    Rejected
                  </Button>
                  <Button className="rounded-md bg-muted/50 px-3 py-1 font-medium text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground">
                    Resolved
                  </Button>
                </div>
              </div>

              <PostsTable />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
