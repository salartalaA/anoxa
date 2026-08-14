import { redirect } from "next/navigation";
import { getAllReportedPosts } from "@/actions/admin/reports";
import { requireActiveUser } from "@/actions/auth";
import type { ReportReason, ReportStatus } from "@/app/generated/prisma/enums";
import ReportedPosts from "./_posts";

export interface ReportedPost {
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

export default async function ReportedPostsPage() {
  const currentUser = (await requireActiveUser()).user;

  if (!currentUser) {
    return redirect("/auth/login");
  }

  if (currentUser.role === "USER") {
    return redirect("/");
  }

  const reportedPosts = (await getAllReportedPosts()) as ReportedPost[];

  return <ReportedPosts reportedPosts={reportedPosts} />;
}
