import prisma from "@/lib/prisma";

export async function dashboardStats() {
  const [
    totalUsers,
    activeUsers,
    totalPosts,
    pendingPostReports,
    pendingCommentReports,
    verifiesUsers,
    suspendedUsers,
    bannedUsers,
    totalComments,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.post.count(),

    prisma.postReport.count({
      where: {
        reportStatus: "PENDING",
      },
    }),

    prisma.commentReport.count({
      where: {
        reportStatus: "PENDING",
      },
    }),

    prisma.user.count({
      where: {
        isVerified: true,
      },
    }),

    prisma.user.count({
      where: {
        status: "SUSPENDED",
      },
    }),

    prisma.user.count({
      where: {
        status: "BANNED",
      },
    }),

    prisma.comment.count(),
  ]);

  return {
    totalUsers,
    activeUsers,
    totalPosts,
    pendingReports: pendingPostReports + pendingCommentReports,
    verifiesUsers,
    suspendedUsers,
    bannedUsers,
    totalComments,
  };
}
