"use server";

import { requireActiveUser } from "@/actions//auth";
import { Prisma } from "@/app/generated/prisma/client";
import type { ReportReason } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";

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
