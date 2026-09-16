"use client";

import { Check, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { updatePostReportStatus } from "@/actions/admin/reports";
import type { ReportReason, ReportStatus } from "@/app/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReportReviewDialogProps {
  date: string | Date;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: ReportStatus) => void;
  open: boolean;
  reason: ReportReason | string;
  reportedContent: string;
  reporterAvatar: string;
  reporterFullName: string;
  reportId: string;
  status: ReportStatus;
}

export function ReportReviewDialog({
  date,
  onOpenChange,
  onStatusChange,
  open,
  reason,
  reportedContent,
  reporterAvatar,
  reporterFullName,
  reportId,
  status,
}: ReportReviewDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(Number(date));

  const handleStatusChange = async (newStatus: ReportStatus) => {
    setIsUpdating(true);

    await updatePostReportStatus(reportId, newStatus);

    onStatusChange(newStatus);

    setIsUpdating(false);
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Report Review</DialogTitle>

          <DialogDescription>
            Review the reported content and take action.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Reporter */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
              {reporterAvatar ? (
                <Image
                  alt={`${reporterFullName} profile`}
                  className="rounded-full object-cover"
                  fill
                  sizes="32px"
                  src={reporterAvatar}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs">
                  {reporterFullName.charAt(0)}
                </span>
              )}
            </span>

            <div>
              <p className="font-medium text-foreground text-sm">
                {reporterFullName}
              </p>

              <p className="text-muted-foreground text-xs">Reporter</p>
            </div>
          </div>

          <dl className="space-y-3 text-sm">
            {/* Reason */}
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Reason</dt>

              <dd className="font-medium text-foreground">{reason}</dd>
            </div>

            {/* Date */}
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Date</dt>

              <dd className="text-foreground">{formattedDate}</dd>
            </div>

            {/* Status */}
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Status</dt>

              <dd className="font-medium text-foreground">{status}</dd>
            </div>

            {/* Reported content */}
            <div>
              <dt className="text-muted-foreground">Reported content</dt>

              <dd className="mt-1 rounded-md border border-border bg-muted/30 p-3 text-foreground">
                {reportedContent || "No caption"}
              </dd>
            </div>
          </dl>

          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Close
            </Button>

            <Button
              className="gap-1.5 border-border text-muted-foreground hover:text-foreground"
              disabled={isUpdating || status === "REJECTED"}
              onClick={() => handleStatusChange("REJECTED")}
              variant="outline"
            >
              <X className="h-4 w-4" />
              Reject
            </Button>

            <Button
              className="gap-1.5 bg-success text-success-foreground hover:bg-success/90"
              disabled={isUpdating || status === "RESOLVED"}
              onClick={() => handleStatusChange("RESOLVED")}
            >
              <Check className="h-4 w-4" />
              Resolve
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
