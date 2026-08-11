"use client";

import { Ellipsis, Flag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { reportcomment } from "@/actions/admin/reports";
import { requireActiveUser } from "@/actions/auth";
import type { ReportReason } from "@/app/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ReportComment({ commentId }: { commentId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenDialog = async () => {
    const result = await requireActiveUser();

    if (!result.success && result.message) {
      return toast.info(result.message, {
        position: "top-right",
        className: "bg-card! text-warning!",
        closeButton: true,
      });
    }

    setDialogOpen(true);
  };

  const handleReportComment = async () => {
    if (!selectedReason) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await reportcomment(commentId, selectedReason);

      if (!result?.success) {
        return toast.info(result?.message, {
          position: "top-right",
          className: "bg-card! text-warning!",
          closeButton: true,
        });
      }

      setDialogOpen(false);
      setSelectedReason(null);

      toast.success("Comment reported to moderators.", {
        position: "top-right",
        className: "bg-card! text-primary!",
        closeButton: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button className="h-auto p-0" size="sm" variant="ghost">
              <Ellipsis size={15} />
            </Button>
          }
        />

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleOpenDialog}>
              <Flag size={16} />
              Report
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedReason(null);
          }
        }}
        open={dialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report comment</DialogTitle>

            <DialogDescription>
              Why are you reporting this comment?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {[
              { value: "SPAM", label: "Spam" },
              { value: "HARASSMENT", label: "Harassment" },
              { value: "HATE_SPEECH", label: "Hate speech" },
              { value: "VIOLENCE", label: "Violence" },
              { value: "NUDITY", label: "Sexual content" },
            ].map((reason) => (
              <Button
                className="w-full justify-start"
                key={reason.value}
                onClick={() => setSelectedReason(reason.value as ReportReason)}
                type="button"
                variant={
                  selectedReason === reason.value ? "secondary" : "ghost"
                }
              >
                {reason.label}
              </Button>
            ))}
          </div>

          <DialogFooter>
            <Button
              disabled={isSubmitting}
              onClick={() => setDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>

            <Button
              disabled={!selectedReason || isSubmitting}
              onClick={handleReportComment}
            >
              {isSubmitting ? "Reporting..." : "Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
