"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const comments = [
  {
    comment: "This comment contains harassment and personal attacks.",
    reporter: "Liam Patel",
    initials: "LP",
    avatarClass: "bg-blue-500/20 text-blue-300",
    reason: "Harassment",
    status: "rejected",
    statusClass: "bg-muted text-muted-foreground ring-border",
    createdAt: "Aug 11, 2025 · 2:40 AM",
  },
  {
    comment: "Click here for free stuff!!!",
    reporter: "John Carter",
    initials: "JC",
    avatarClass: "bg-rose-500/20 text-rose-300",
    reason: "Spam",
    status: "under review",
    statusClass: "bg-primary/10 text-primary ring-primary/30",
    createdAt: "Aug 10, 2025 · 8:00 AM",
  },
  {
    comment: "Spam link to a phishing site. Please remove.",
    reporter: "Noah Kim",
    initials: "NK",
    avatarClass: "bg-violet-500/20 text-violet-300",
    reason: "Spam",
    status: "under review",
    statusClass: "bg-primary/10 text-primary ring-primary/30",
    createdAt: "Aug 10, 2025 · 7:50 AM",
  },
  {
    comment: "Tabs > spaces. Fight me.",
    reporter: "Ethan Wright",
    initials: "EW",
    avatarClass: "bg-orange-500/20 text-orange-300",
    reason: "Inflammatory Content",
    status: "resolved",
    statusClass: "bg-success/10 text-success ring-success/30",
    createdAt: "Aug 7, 2025 · 5:30 AM",
  },
  {
    comment: "First half-marathon in the books 🏅",
    reporter: "Sophia Lee",
    initials: "SL",
    avatarClass: "bg-cyan-500/20 text-cyan-300",
    reason: "Misinformation",
    status: "rejected",
    statusClass: "bg-muted text-muted-foreground ring-border",
    createdAt: "Aug 3, 2025 · 11:30 AM",
  },
  {
    comment: "Absolutely unhinged take. Spaces forever.",
    reporter: "Isabella Nguyen",
    initials: "IN",
    avatarClass: "bg-rose-500/20 text-rose-300",
    reason: "Rude Behavior",
    status: "pending",
    statusClass: "bg-warning/10 text-warning ring-warning/30",
    createdAt: "Aug 7, 2025 · 2:15 AM",
  },
  {
    comment: "Elevation day 🏔️",
    reporter: "Liam Patel",
    initials: "LP",
    avatarClass: "bg-blue-500/20 text-blue-300",
    reason: "Minor Issue",
    status: "rejected",
    statusClass: "bg-muted text-muted-foreground ring-border",
    createdAt: "Aug 9, 2025 · 1:00 PM",
  },
];

export default function CommentsTable() {
  return (
    <div className="overflow-x-auto">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Reporter</TableHead>

              <TableHead className="min-w-[280px]">Reported Comment</TableHead>

              <TableHead className="hidden md:table-cell">Reason</TableHead>

              <TableHead>Status</TableHead>

              <TableHead className="hidden lg:table-cell">Created</TableHead>

              <TableHead className="w-12 pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {comments.map((comment) => (
              <TableRow
                className="group"
                key={`${comment.reporter}-${comment.createdAt}`}
              >
                <TableCell className="pl-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-semibold text-[10px] tracking-wide ring-1 ring-border ${comment.avatarClass}`}
                    >
                      {comment.initials}
                    </div>

                    <span className="text-foreground text-sm">
                      {comment.reporter}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="max-w-[320px]">
                  <p className="truncate text-foreground text-sm">
                    {comment.comment}
                  </p>
                </TableCell>

                <TableCell className="hidden text-muted-foreground text-sm md:table-cell">
                  {comment.reason}
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-[11px] uppercase tracking-wide ring-1 ring-inset ${comment.statusClass}`}
                  >
                    {comment.status}
                  </span>
                </TableCell>

                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {comment.createdAt}
                </TableCell>

                <TableCell className="pr-4 text-right">
                  <Button
                    className="h-8 w-8 opacity-60 group-hover:opacity-100"
                    size="icon"
                    variant="ghost"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
