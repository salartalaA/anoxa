"use server";

import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/uploader";
import type { PostData } from "@/schemas/feed.schema";
import { getCurrentUser } from "./auth";

export async function createPost(newPost: PostData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  if (!newPost.image) {
    return;
  }

  const uploadedImage = await uploadImage(newPost.image);

  await prisma.post.create({
    data: {
      caption: newPost.caption ?? "",
      imageURL: uploadedImage.url,
      authorId: currentUser.id,
      cloudinaryPublicId: uploadedImage.publicId,
    },
  });

  revalidatePath("/");
}

export async function editPost(updatedPost: PostData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  if (!updatedPost.image) {
    return;
  }

  const post = await prisma.post.findFirst({
    where: {
      id: updatedPost.id,
      authorId: currentUser.id,
    },
  });

  if (!post) {
    return;
  }

  const uploadedImage = await uploadImage(updatedPost.image);

  await prisma.post.update({
    data: {
      caption: updatedPost.caption,
      imageURL: uploadedImage.url,
      authorId: currentUser.id,
      cloudinaryPublicId: uploadedImage.publicId,
    },
    where: {
      id: updatedPost.id,
    },
  });

  revalidatePath("/");
}

export async function getPosts() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      likes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts.map((post) => ({
    ...post,
    isOwner: post.authorId === currentUser.id,
    isLiked: post.likes.some((like) => like.userId === currentUser.id),

    comments: post.comments.map((comment) => ({
      ...comment,
      isOwner: comment.authorId === currentUser.id,
    })),
  }));
}

export async function deletePost(postId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  const post = await prisma.post.findFirst({
    where: {
      id: postId,
      authorId: currentUser.id,
    },
  });

  if (!post) {
    return;
  }

  await cloudinary.uploader.destroy(post.cloudinaryPublicId);

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  revalidatePath("/");
}
