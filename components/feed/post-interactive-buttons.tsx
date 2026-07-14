"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bookmark,
  Heart,
  Loader2,
  MessageSquare,
  Share2,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createComment, deleteComment } from "@/actions/comments";
import { toggleLike } from "@/actions/likes";
import type { Like, Prisma } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils/time-ago";
import { type CommentData, commentSchema } from "@/schemas/feed.schema";
import { Textarea } from "../ui/textarea";

type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: {
    author: true;
  };
}> & {
  isOwner: boolean;
};

export default function PostInteractiveButtons({
  currentUserAvatar,
  currentFullName,
  postId,
  comments,
  isLiked,
  likes,
}: {
  currentUserAvatar: string;
  currentFullName: string;
  postId: string;
  comments: CommentWithAuthor[];
  isLiked: boolean;
  likes: Like[];
}) {
  const [showComment, setShowComment] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (newComment: CommentData) => {
    await createComment(newComment.comment, postId);

    reset();

    toast.success("Comment added successfully!", {
      position: "top-right",
      className: "bg-card! text-primary!",
      closeButton: true,
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);

    toast.success("Comment deleted successfully!", {
      position: "top-right",
      className: "bg-card! text-primary!",
      closeButton: true,
    });
  };

  const handleLike = async (postId: string) => {
    await toggleLike(postId);
  };

  return (
    <div className="flex flex-col items-center p-6 pt-0">
      <div className="flex w-full items-center justify-between pt-3">
        <div className="flex items-center gap-1">
          <Button
            className="gap-1.5 px-3"
            onClick={() => handleLike(postId)}
            size="sm"
            variant="ghost"
          >
            {/* <Heart className="h-4 w-4" /> */}
            <Heart className={cn("h-4 w-4", isLiked && "fill-pink-600")} />
            <span className="text-xs">{likes.length ?? 0}</span>
          </Button>

          <Button
            className="gap-1.5 px-3"
            onClick={() => setShowComment(!showComment)}
            size="sm"
            variant="ghost"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">{comments.length ?? 0}</span>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button className="px-3" size="sm" variant="ghost">
            <Bookmark className="h-4 w-4" />
          </Button>

          <Button className="px-3" size="sm" variant="ghost">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showComment && (
        <form
          className="mt-3 w-full space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {comments.length > 0 ? (
            <div className="mt-3 space-y-4">
              {comments.map((comment) => (
                <div className="flex items-center gap-3" key={comment.id}>
                  <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-muted font-semibold text-xs">
                      {comment.author.avatarURL ? (
                        <Image
                          alt="User Profile"
                          fill
                          src={comment.author.avatarURL}
                        />
                      ) : (
                        comment.author.fullName.charAt(0)
                      )}
                    </span>
                  </span>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {comment.author.fullName}
                      </span>

                      <span className="text-muted-foreground text-xs">
                        @{comment.author.username}
                      </span>

                      <span className="text-muted-foreground text-xs">•</span>

                      <span className="text-muted-foreground text-xs">
                        {timeAgo(comment.createdAt)}
                      </span>

                      {comment.isOwner && (
                        <Trash2
                          className="ml-auto text-destructive"
                          onClick={() => handleDeleteComment(comment.id)}
                          size={18}
                        />
                      )}
                    </div>

                    <p className="mt-1 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                    {/* 
                <div className="mt-2 flex items-center gap-3">
                  <button
                    className="font-medium text-muted-foreground text-xs hover:text-foreground"
                    type="button"
                  >
                    Like
                  </button>

                  <button
                    className="font-medium text-muted-foreground text-xs hover:text-foreground"
                    type="button"
                  >
                    Reply
                  </button>
                </div> */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-muted-foreground text-xs">
              No comments yet
            </p>
          )}

          <div className="flex items-center gap-2 pt-2">
            <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs">
                {currentUserAvatar ? (
                  <Image alt="user-profile" fill src={currentUserAvatar} />
                ) : (
                  currentFullName.charAt(0)
                )}
              </span>
            </span>

            <div className="flex flex-1 gap-2">
              <Textarea
                className="min-h-9 max-w-[486px]"
                placeholder="Write a comment..."
                rows={1}
                {...register("comment")}
              />

              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Commenting...
                  </>
                ) : (
                  "Comment"
                )}
              </Button>
            </div>
          </div>

          {errors.comment && (
            <p className="mt-1 text-destructive text-sm">
              {errors.comment.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
