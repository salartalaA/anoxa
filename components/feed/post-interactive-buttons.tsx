"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bookmark,
  Heart,
  Laugh,
  Loader2,
  MessageSquare,
  Pencil,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { requireActiveUser } from "@/actions/auth";
import { toggleBookmark } from "@/actions/bookmarks";
import {
  createComment,
  deleteComment,
  updateComment,
} from "@/actions/comments";
import { toggleReaction } from "@/actions/reactions";
import type { Prisma, ReactionType } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils/time-ago";
import { type CommentData, commentSchema } from "@/schemas/feed.schema";
import { ReportComment } from "../report-comment";
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
  authorId,
  comments,
  isBookmarked,
  reactionSummery,
  currentUserReaction,
}: {
  currentUserAvatar: string;
  currentFullName: string;
  postId: string;
  authorId: string;
  comments: CommentWithAuthor[];
  isBookmarked: boolean;
  reactionSummery: Record<ReactionType, number> & { total: number };
  currentUserReaction: ReactionType | null;
}) {
  const [showComment, setShowComment] = useState(false);
  const [isCommentEditing, setIsCommentEditing] = useState<{
    id: string;
    comment: string;
  } | null>(null);

  const reactions = [
    {
      type: "HEART",
      icon: Heart,
      activeClassName: "fill-pink-600",
      count: reactionSummery.HEART,
    },
    {
      type: "LAUGH",
      icon: Laugh,
      activeClassName: "fill-yellow-600",
      count: reactionSummery.LAUGH,
    },
    {
      type: "LIKE",
      icon: ThumbsUp,
      activeClassName: "fill-blue-600",
      count: reactionSummery.LIKE,
    },
    {
      type: "DISLIKE",
      icon: ThumbsDown,
      activeClassName: "fill-red-700",
      count: reactionSummery.DISLIKE,
    },
  ] as const;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CommentData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (comment: CommentData) => {
    if (isCommentEditing) {
      const result = await updateComment(comment.content, isCommentEditing.id);

      if (!result?.success && result?.message) {
        return toast.info(result?.message, {
          position: "top-right",
          className: "bg-card! text-warning!",
          closeButton: true,
        });
      }

      toast.success("Comment edited successfully!", {
        position: "top-right",
        className: "bg-card! text-primary!",
        closeButton: true,
      });
    } else {
      const result = await createComment(comment.content, postId, authorId);

      if (!result?.success && result?.message) {
        return toast.info(result?.message, {
          position: "top-right",
          className: "bg-card! text-warning!",
          closeButton: true,
        });
      }

      toast.success("Comment added successfully!", {
        position: "top-right",
        className: "bg-card! text-primary!",
        closeButton: false,
      });
    }

    setIsCommentEditing(null);

    reset();
  };

  const handleDeleteComment = async (commentId: string) => {
    const result = await deleteComment(commentId, postId, authorId);

    if (!result?.success && result?.message) {
      return toast.info(result?.message, {
        position: "top-right",
        className: "bg-card! text-warning!",
        closeButton: true,
      });
    }

    setIsCommentEditing(null);

    reset();

    toast.success("Comment deleted successfully!", {
      position: "top-right",
      className: "bg-card! text-primary!",
      closeButton: true,
    });
  };

  const handleReaction = async (postId: string, reactionType: ReactionType) => {
    const result = await requireActiveUser();

    if (!result.success && result.message) {
      return toast.info(result.message, {
        position: "top-right",
        className: "bg-card! text-warning!",
        closeButton: true,
      });
    }

    await toggleReaction(authorId, postId, reactionType);
  };

  const handleBookmark = async (postId: string) => {
    await toggleBookmark(postId);
  };

  const handleShare = async (postId: string) => {
    const postURL =
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/#${postId}`
        : `https://anoxa.vercel.app/#${postId}`;

    if (navigator.share) {
      await navigator.share({
        url: postURL,
      });
    } else {
      await navigator.clipboard.writeText(postURL);

      toast.success("Copied to clipboard", {
        position: "top-right",
        className: "bg-card! text-primary!",
        closeButton: true,
      });
    }
  };

  return (
    <div className="flex flex-col items-center p-6 pt-0">
      <div className="flex w-full items-center justify-between pt-3">
        <div className="flex gap-3">
          {reactions.map((reaction) => {
            const Icon = reaction.icon;

            return (
              <HoverCard key={reaction.type}>
                <HoverCardTrigger
                  closeDelay={100}
                  delay={700}
                  render={
                    <Button
                      className="gap-1.5"
                      onClick={() => handleReaction(postId, reaction.type)}
                      size="sm"
                      variant="ghost"
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          currentUserReaction === reaction.type &&
                            reaction.activeClassName
                        )}
                      />
                    </Button>
                  }
                />
                <HoverCardContent className="w-fit">
                  <span className="text-primary text-sm">{reaction.count}</span>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <Button
            className="gap-1.5 px-3"
            onClick={() => setShowComment(!showComment)}
            size="sm"
            variant="ghost"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">{comments.length ?? 0}</span>
          </Button>

          <Button
            className="px-3"
            onClick={() => handleBookmark(postId)}
            size="sm"
            variant="ghost"
          >
            <Bookmark
              className={cn("h-4 w-4", isBookmarked && "fill-primary")}
            />
          </Button>

          <Button
            className="px-3"
            onClick={() => handleShare(postId)}
            size="sm"
            variant="ghost"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {reactionSummery.total > 0 && (
        <span className="mt-3 mr-auto ml-3 text-foreground/40 text-xs">
          Total Reactions: {reactionSummery.total}
        </span>
      )}

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
                    <div className="flex items-center justify-between gap-2">
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

                        {comment.isEdited && (
                          <>
                            <span className="text-muted-foreground text-xs">
                              •
                            </span>

                            <span className="text-muted-foreground text-xs">
                              edited
                            </span>
                          </>
                        )}
                      </div>

                      {/* {comment.isOwner && (
                        <div className="flex items-center gap-x-2">
                          <Pencil
                            className="text-primary"
                            onClick={() => {
                              setIsCommentEditing({
                                id: comment.id,
                                comment: comment.content,
                              });
                              setValue("content", comment.content);
                            }}
                            size={15}
                          />
                          <Trash2
                            className="text-destructive"
                            onClick={() => handleDeleteComment(comment.id)}
                            size={18}
                          />
                        </div>
                      )} */}

                      <div className="flex items-center gap-x-2">
                        {comment.isOwner ? (
                          <>
                            <Pencil
                              className="text-primary"
                              onClick={() => {
                                setIsCommentEditing({
                                  id: comment.id,
                                  comment: comment.content,
                                });
                                setValue("content", comment.content);
                              }}
                              size={15}
                            />

                            <Trash2
                              className="text-destructive"
                              onClick={() => handleDeleteComment(comment.id)}
                              size={18}
                            />
                          </>
                        ) : (
                          <ReportComment commentId={comment.id} />
                        )}
                      </div>
                    </div>

                    <p className="mt-1 text-start text-sm leading-relaxed">
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
                {...register("content")}
                defaultValue={isCommentEditing?.comment ?? ""}
              />

              {isCommentEditing && (
                <Button
                  onClick={() => {
                    setIsCommentEditing(null);
                    reset();
                  }}
                  variant="destructive"
                >
                  Cancel
                </Button>
              )}

              <div>
                {isCommentEditing ? (
                  <Button disabled={isSubmitting} type="submit">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Editing...
                      </>
                    ) : (
                      "Edit"
                    )}
                  </Button>
                ) : (
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
                )}
              </div>
            </div>
          </div>

          {errors.content && (
            <p className="mt-1 text-destructive text-sm">
              {errors.content.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
