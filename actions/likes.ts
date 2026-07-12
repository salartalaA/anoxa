"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";

export async function toggleLike(postId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: currentUser.id,
        postId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    await prisma.like.create({
      data: {
        userId: currentUser.id,
        postId,
      },
    });
  }

  revalidatePath("/");
}
