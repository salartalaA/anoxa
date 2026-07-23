"use server";

import { revalidatePath } from "next/cache";
import type { ReactionType } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";

export async function toggleReaction(postId: string, type: ReactionType) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

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
        type,
      },
    });

    revalidatePath("/");

    return createdReaction;
  }

  if (existingReaction.type === type) {
    const deletedReaction = await prisma.reaction.delete({
      where: {
        id: existingReaction.id,
      },
    });

    revalidatePath("/");

    return deletedReaction;
  }

  await prisma.reaction.update({
    data: {
      type,
    },
    where: {
      id: existingReaction.id,
    },
  });

  revalidatePath("/");
}
