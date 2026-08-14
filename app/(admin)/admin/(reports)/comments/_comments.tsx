"use client";

import { RefreshCw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { ReportStatus } from "@/app/generated/prisma/enums";
import CommentsTable from "@/components/admin/comments/comments-table";
import AdminMainHeader from "@/components/sidebar/admin/admin-main-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ReportedComment } from "./page";

type Filter = "ALL" | ReportStatus;

export default function ReportedComments({
  reportedComments,
}: {
  reportedComments: ReportedComment[];
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const filteredComments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return reportedComments.filter((report) => {
      const matchesSearch =
        normalizedSearch === "" ||
        report.comment.content.toLowerCase().includes(normalizedSearch) ||
        report.user.fullName.toLowerCase().includes(normalizedSearch);

      const matchesFilter = filter === "ALL" || report.reportStatus === filter;

      return matchesSearch && matchesFilter;
    });
  }, [reportedComments, search, filter]);

  const getButtonClass = (buttonFilter: Filter) => {
    if (filter === buttonFilter) {
      return "rounded-md bg-primary px-3 font-medium text-primary-foreground text-xs transition-colors";
    }

    return "rounded-md bg-muted/50 px-3 py-1 font-medium text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground";
  };

  return (
    <>
      <AdminMainHeader
        description="Review and moderate user-generated comments."
        title="Comments"
      />

      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="animate-fade-in">
          <div className="space-y-4">
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="flex flex-col space-y-4 p-6 pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-semibold text-base tracking-tight">
                    Comments
                  </h3>

                  <div className="relative w-full sm:max-w-xs">
                    <Search
                      className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />

                    <Input
                      className="px-3 py-1 pl-9"
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search by comments or author"
                      type="text"
                      value={search}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    <Button
                      className={getButtonClass("ALL")}
                      onClick={() => setFilter("ALL")}
                      type="button"
                    >
                      All
                    </Button>

                    <Button
                      className={getButtonClass("PENDING")}
                      onClick={() => setFilter("PENDING")}
                      type="button"
                    >
                      Pending
                    </Button>

                    <Button
                      className={getButtonClass("UNDER_REVIEW")}
                      onClick={() => setFilter("UNDER_REVIEW")}
                      type="button"
                    >
                      Under Review
                    </Button>

                    <Button
                      className={getButtonClass("REJECTED")}
                      onClick={() => setFilter("REJECTED")}
                      type="button"
                    >
                      Rejected
                    </Button>

                    <Button
                      className={getButtonClass("RESOLVED")}
                      onClick={() => setFilter("RESOLVED")}
                      type="button"
                    >
                      Resolved
                    </Button>
                  </div>

                  <Button
                    className="h-10 transition-opacity disabled:opacity-60"
                    disabled={isPending}
                    onClick={handleRefresh}
                    variant="outline"
                  >
                    <RefreshCw
                      className={isPending ? "animate-spin" : ""}
                      size={20}
                    />
                    {isPending ? "Refreshing..." : "Refresh"}
                  </Button>
                </div>
              </div>

              {filteredComments.length > 0 ? (
                <CommentsTable reportedComments={filteredComments} />
              ) : (
                <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <h3 className="font-semibold text-foreground text-sm">
                    No comments found
                  </h3>

                  {(search.trim() || filter !== "ALL") && (
                    <Button
                      className="mt-4"
                      onClick={() => {
                        setSearch("");
                        setFilter("ALL");
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
