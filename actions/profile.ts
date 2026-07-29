"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import type { EditProfileData } from "@/schemas/auth.schema";
import { getCurrentUser, requireActiveUser } from "./auth";

export async function getProfileStats(userId: string) {
  const [posts, comments, reactions] = await Promise.all([
    prisma.post.count({
      where: {
        authorId: userId,
      },
    }),

    prisma.comment.count({
      where: {
        post: {
          authorId: userId,
        },
      },
    }),

    prisma.reaction.count({
      where: {
        post: {
          authorId: userId,
        },
      },
    }),
  ]);

  return {
    posts,
    comments,
    reactions,
  };
}

export async function getProfile(username: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  return await prisma.user.findUnique({
    where: {
      username,
    },
  });
}

export async function updateProfile(
  updatedUser: EditProfileData,
  userId: string
) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const currentUser = result.user;

  if (currentUser.id !== userId) {
    return;
  }

  await prisma.user.update({
    data: {
      fullName: updatedUser.fullName,
      bio: updatedUser.bio,
      avatarURL: updatedUser.avatarURL,
    },
    where: {
      id: currentUser.id,
    },
  });

  revalidatePath(`/profile/${currentUser.username}`);
}
