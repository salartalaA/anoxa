"use server";

import { revalidatePath } from "next/cache";
import { requireActiveUser } from "@/actions//auth";
import { Prisma } from "@/app/generated/prisma/client";
import type { ReportReason, ReportStatus } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { hasPermission } from "./role";

export async function reportPost(postId: string, reportReason: ReportReason) {
  try {
    const result = await requireActiveUser();

    if (!result.success) {
      return result;
    }

    const currentUser = result.user;

    const existingPost = await prisma.post.findFirst({
      where: {
        id: postId,
      },
    });

    if (!existingPost) {
      return null;
    }

    const newReport = await prisma.postReport.create({
      data: {
        postId,
        userId: currentUser.id,
        reason: reportReason,
      },
    });

    return {
      success: true,
      report: newReport,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "You have already reported this post.",
      };
    }

    return {
      success: false,
      message: "You have already reported this post.",
    };
  }
}

export async function reportcomment(
  commentId: string,
  reportReason: ReportReason
) {
  try {
    const result = await requireActiveUser();

    if (!result.success) {
      return result;
    }

    const currentUser = result.user;

    const existingComment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!existingComment) {
      return null;
    }

    const newReport = await prisma.commentReport.create({
      data: {
        reason: reportReason,
        commentId,
        userId: currentUser.id,
      },
    });

    return {
      success: true,
      report: newReport,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "You have already reported this comment!",
      };
    }

    return {
      success: false,
      message: "You have already reported this comment!",
    };
  }
}

export async function getAllReportedPosts() {
  const currentUser = (await requireActiveUser()).user;

  if (!currentUser) {
    return null;
  }

  const checkPerm = await hasPermission("VIEW_REPORT");

  if (!checkPerm) {
    return null;
  }

  const postReports = await prisma.postReport.findMany({
    include: {
      user: {
        select: {
          fullName: true,
          avatarURL: true,
        },
      },
      post: {
        select: {
          caption: true,
        },
      },
    },
  });

  return postReports;
}

export async function updatePostReportStatus(
  reportId: string,
  newStatus: ReportStatus
) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const hasPerm = await hasPermission("REVIEW_REPORT");

  if (!hasPerm) {
    return null;
  }

  const currentAdmin = result.user;

  const existingReport = await prisma.postReport.findUnique({
    where: {
      id: reportId,
    },
  });

  if (!existingReport) {
    return null;
  }

  const updatedUser = await prisma.postReport.update({
    data: {
      reportStatus: newStatus,
    },
    where: {
      id: reportId,
    },
  });

  revalidatePath("/admin/posts");

  return updatedUser;
}

export async function getAllReportedComments() {
  const currentUser = (await requireActiveUser()).user;

  if (!currentUser) {
    return null;
  }

  const checkPerm = await hasPermission("VIEW_REPORT");

  if (!checkPerm) {
    return null;
  }

  const commentReports = await prisma.commentReport.findMany({
    include: {
      user: {
        select: {
          fullName: true,
          avatarURL: true,
        },
      },
      comment: {
        select: {
          content: true,
        },
      },
    },
  });

  return commentReports;
}

export async function updateCommentReportStatus(
  reportId: string,
  newStatus: ReportStatus
) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const hasPerm = await hasPermission("REVIEW_REPORT");

  if (!hasPerm) {
    return null;
  }

  const currentAdmin = result.user;

  const existingReport = await prisma.commentReport.findUnique({
    where: {
      id: reportId,
    },
  });

  if (!existingReport) {
    return null;
  }

  const updatedReport = await prisma.commentReport.update({
    data: {
      reportStatus: newStatus,
    },
    where: {
      id: reportId,
    },
  });

  revalidatePath("/admin/comments");

  return updatedReport;
}
