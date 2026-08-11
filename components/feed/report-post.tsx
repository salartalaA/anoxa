"use client";

import { Ellipsis, Flag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { reportPost } from "@/actions/admin/reports";
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

export function ReportPost({ postId }: { postId: string }) {
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

  const handleReportPost = async () => {
    const result = await requireActiveUser();

    if (!result.success && result.message) {
      return toast.info(result.message, {
        position: "top-right",
        className: "bg-card! text-warning!",
        closeButton: true,
      });
    }

    if (!selectedReason) {
      return;
    }

    setIsSubmitting(true);

    try {
      const reportResult = await reportPost(postId, selectedReason);

      if (!reportResult?.success) {
        toast.info(reportResult?.message, {
          position: "top-right",
          className: "bg-card! text-warning!",
          closeButton: true,
        });

        return;
      }

      setDialogOpen(false);
      setSelectedReason(null);

      toast.success("Post reported to moderators.", {
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
            <Button variant="ghost">
              <Ellipsis size={20} />
            </Button>
          }
        />

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleOpenDialog}>
              <Flag size={20} />
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
            <DialogTitle>Report post</DialogTitle>

            <DialogDescription>
              Why are you reporting this post?
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
              onClick={handleReportPost}
            >
              {isSubmitting ? "Reporting..." : "Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
