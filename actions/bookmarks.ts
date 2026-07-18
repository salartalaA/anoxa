"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";

export async function toggleBookmark(postId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_postId: {
        userId: currentUser.id,
        postId,
      },
    },
  });

  if (existingBookmark) {
    await prisma.bookmark.delete({
      where: {
        id: existingBookmark.id,
      },
    });
  } else {
    await prisma.bookmark.create({
      data: {
        userId: currentUser.id,
        postId,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/bookmarks");
}
