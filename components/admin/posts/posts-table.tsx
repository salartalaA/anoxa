"use client";

import { Check, Ellipsis, Eye, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { updatePostReportStatus } from "@/actions/admin/reports";
import type { ReportReason, ReportStatus } from "@/app/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ReportReviewDialog } from "../report-review-dialog";

interface ReportedPost {
  createdAt: Date;
  id: string;
  post: { caption: string };
  postId: string;
  reason: ReportReason;
  reportStatus: ReportStatus;
  user: {
    fullName: string;
    avatarURL: string | null;
  };
  userId: string;
}

export default function PostsTable({
  reportedPosts,
}: {
  reportedPosts: ReportedPost[];
}) {
  const [reports, setReports] = useState(reportedPosts);

  const [selectedReport, setSelectedReport] = useState<ReportedPost | null>(
    null
  );

  const [reviewOpen, setReviewOpen] = useState(false);

  const handleReviewReport = async (report: ReportedPost) => {
    let updatedReport = report;

    if (report.reportStatus === "PENDING") {
      await updatePostReportStatus(report.id, "UNDER_REVIEW");

      updatedReport = {
        ...report,
        reportStatus: "UNDER_REVIEW",
      };

      setReports((currentReports) =>
        currentReports.map((item) =>
          item.id === report.id ? updatedReport : item
        )
      );
    }

    setSelectedReport(updatedReport);
    setReviewOpen(true);
  };

  const handleDialogStatusChange = (status: ReportStatus) => {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === selectedReport?.id
          ? { ...report, reportStatus: status }
          : report
      )
    );

    setSelectedReport((currentReport) =>
      currentReport ? { ...currentReport, reportStatus: status } : currentReport
    );
  };

  const handleRejectReport = async (report: ReportedPost) => {
    await updatePostReportStatus(report.id, "REJECTED");

    const updatedReport = {
      ...report,
      reportStatus: "REJECTED" as ReportStatus,
    };

    setReports((currentReports) =>
      currentReports.map((item) =>
        item.id === report.id ? updatedReport : item
      )
    );
  };

  const handleResolveReport = async (report: ReportedPost) => {
    await updatePostReportStatus(report.id, "RESOLVED");

    const updatedReport = {
      ...report,
      reportStatus: "RESOLVED" as ReportStatus,
    };

    setReports((currentReports) =>
      currentReports.map((item) =>
        item.id === report.id ? updatedReport : item
      )
    );
  };

  const getStatusClass = (status: ReportStatus) => {
    switch (status) {
      case "UNDER_REVIEW":
        return "bg-primary/10 text-primary ring-primary/30";

      case "REJECTED":
        return "bg-muted text-muted-foreground ring-border";

      case "RESOLVED":
        return "bg-success/10 text-success ring-success/30";

      default:
        return "bg-warning/10 text-warning ring-warning/30";
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Reporter</TableHead>
                <TableHead className="min-w-[280px]">Reported Post</TableHead>
                <TableHead className="hidden md:table-cell">Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
                <TableHead className="w-12 pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {reports.map((report) => {
                const formattedDate = new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }).format(report.createdAt);

                return (
                  <TableRow className="group" key={report.id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                          {report.user.avatarURL ? (
                            <Image
                              alt={`${report.user.fullName} profile`}
                              className="rounded-full object-cover"
                              fill
                              sizes="32px"
                              src={report.user.avatarURL}
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs">
                              {report.user.fullName.charAt(0)}
                            </span>
                          )}
                        </span>

                        <span className="text-foreground text-sm">
                          {report.user.fullName}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="max-w-[320px]">
                      <p className="truncate text-foreground text-sm">
                        {report.post.caption}
                      </p>
                    </TableCell>

                    <TableCell className="hidden text-muted-foreground text-sm md:table-cell">
                      {report.reason}
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-[11px] uppercase tracking-wide ring-1 ring-inset",
                          getStatusClass(report.reportStatus)
                        )}
                      >
                        {report.reportStatus}
                      </span>
                    </TableCell>

                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      {formattedDate}
                    </TableCell>

                    <TableCell className="pr-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              className="h-8 w-8 opacity-60 group-hover:opacity-100"
                              size="icon"
                              variant="ghost"
                            >
                              <Ellipsis className="h-4 w-4" />
                              <span className="sr-only">Open actions</span>
                            </Button>
                          }
                        />

                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem
                              onClick={() => handleReviewReport(report)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Review
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-success focus:text-success"
                              disabled={report.reportStatus === "RESOLVED"}
                              onClick={() => handleResolveReport(report)}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Resolve
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-muted-foreground focus:text-muted-foreground"
                              disabled={report.reportStatus === "REJECTED"}
                              onClick={() => handleRejectReport(report)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <ReportReviewDialog
        date={selectedReport?.createdAt ?? ""}
        onOpenChange={setReviewOpen}
        onStatusChange={handleDialogStatusChange}
        open={reviewOpen}
        reason={selectedReport?.reason ?? ""}
        reportedContent={selectedReport?.post.caption ?? ""}
        reporterAvatar={selectedReport?.user.avatarURL ?? ""}
        reporterFullName={selectedReport?.user.fullName ?? ""}
        reportId={selectedReport?.id ?? ""}
        status={selectedReport?.reportStatus ?? "PENDING"}
      />
    </>
  );
}
