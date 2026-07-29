"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireActiveUser } from "./auth";

export async function createComment(
  newComment: string,
  postId: string,
  authorId: string
) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const currentUser = result.user;

  await prisma.comment.create({
    data: {
      content: newComment,
      postId,
      authorId: currentUser.id,
    },
  });

  if (currentUser.id !== authorId) {
    await prisma.notification.create({
      data: {
        senderId: currentUser.id,
        receiverId: authorId,
        postId,
        type: "COMMENT",
      },
    });
  }

  revalidatePath("/");
}

export async function deleteComment(
  commentId: string,
  postId: string,
  authorId: string
) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const currentUser = result.user;

  const deletedComment = await prisma.comment.deleteMany({
    where: {
      id: commentId,
      authorId: currentUser.id,
    },
  });

  const existingNotification = await prisma.notification.findFirst({
    where: {
      postId,
      senderId: currentUser.id,
      receiverId: authorId,
      type: "COMMENT",
    },
  });

  if (deletedComment.count === 0) {
    return;
  }

  if (currentUser.id !== authorId) {
    await prisma.notification.delete({
      where: {
        id: existingNotification?.id,
      },
    });
  }

  revalidatePath("/");
}

export async function updateComment(
  updatedCommentContent: string,
  updatedCommentId: string
) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const currentUser = result.user;

  const updatedComment = await prisma.comment.update({
    data: {
      content: updatedCommentContent,
      isEdited: true,
    },
    where: {
      id: updatedCommentId,
      authorId: currentUser.id,
    },
  });

  if (!updatedComment) {
    return;
  }

  revalidatePath("/");
}
