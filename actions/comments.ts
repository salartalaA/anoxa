"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";

export async function createComment(newComment: string, postId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  await prisma.comment.create({
    data: {
      content: newComment,
      postId,
      authorId: currentUser.id,
    },
  });

  revalidatePath("/");
}

export async function deleteComment(commentId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  revalidatePath("/");
}
