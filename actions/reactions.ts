"use server";

import { revalidatePath } from "next/cache";
import type { ReactionType } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { requireActiveUser } from "./auth";

export async function toggleReaction(
  authorId: string,
  postId: string,
  reactionType: ReactionType
) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const currentUser = result.user;

  const existingReaction = await prisma.reaction.findUnique({
    where: {
      userId_postId: {
        userId: currentUser.id,
        postId,
      },
    },
  });

  if (!existingReaction) {
    const createdReaction = await prisma.reaction.create({
      data: {
        postId,
        userId: currentUser.id,
        type: reactionType,
      },
    });

    if (currentUser.id !== authorId) {
      await prisma.notification.create({
        data: {
          postId,
          senderId: currentUser.id,
          receiverId: authorId,
          type: "REACTION",
          reactionType,
        },
      });
    }

    revalidatePath("/");

    return createdReaction;
  }

  const existingNotification = await prisma.notification.findFirst({
    where: {
      postId,
      receiverId: authorId,
      senderId: currentUser.id,
      type: "REACTION",
    },
  });

  if (existingReaction.type === reactionType) {
    const deletedReaction = await prisma.reaction.delete({
      where: {
        id: existingReaction.id,
      },
    });

    if (currentUser.id !== authorId) {
      await prisma.notification.delete({
        where: {
          id: existingNotification?.id,
        },
      });
    }

    revalidatePath("/");

    return deletedReaction;
  }

  await prisma.reaction.update({
    data: {
      type: reactionType,
    },
    where: {
      id: existingReaction.id,
    },
  });

  if (currentUser.id !== authorId) {
    await prisma.notification.update({
      data: {
        reactionType,
      },
      where: {
        id: existingNotification?.id,
      },
    });
  }

  revalidatePath("/Z");
}
