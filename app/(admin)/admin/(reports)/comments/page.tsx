import { redirect } from "next/navigation";
import { getAllReportedComments } from "@/actions/admin/reports";
import { requireActiveUser } from "@/actions/auth";
import type { ReportReason, ReportStatus } from "@/app/generated/prisma/enums";
import ReportedComments from "./_comments";

export interface ReportedComment {
  comment: {
    content: string;
  };
  commentId: string;
  createdAt: Date;
  id: string;
  reason: ReportReason;
  reportStatus: ReportStatus;
  user: {
    fullName: string;
    avatarURL: string | null;
  };
  userId: string;
}

export default async function ReportedCommentsPage() {
  const currentUser = (await requireActiveUser()).user;

  if (!currentUser) {
    return redirect("/auth/login");
  }

  if (currentUser.role === "USER") {
    return redirect("/");
  }

  const reportedComments =
    (await getAllReportedComments()) as ReportedComment[];

  return <ReportedComments reportedComments={reportedComments} />;
}
