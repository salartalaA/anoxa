"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bookmark, Heart, Loader2, MessageSquare, Share2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { type CommentData, commentSchema } from "@/schemas/feed.schema";
import { Textarea } from "../ui/textarea";

export default function PostInteractiveButtons() {
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
    await new Promise((resolver) => setTimeout(resolver, 500));

    console.log(newComment);

    reset();
  };

  return (
    <div className="flex flex-col items-center p-6 pt-0">
      <div className="flex w-full items-center justify-between border-t pt-3">
        <div className="flex items-center gap-1">
          <Button className="gap-1.5 px-3" size="sm" variant="ghost">
            <Heart className="h-4 w-4" />
            <span className="text-xs">0</span>
          </Button>

          <Button
            className="gap-1.5 px-3"
            onClick={() => setShowComment(!showComment)}
            size="sm"
            variant="ghost"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">0</span>
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
          className="mt-3 w-full space-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className="py-4 text-center text-muted-foreground text-xs">
            No comments yet
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs">
                S
              </span>
            </span>
            <div className="flex flex-1 gap-2">
              <Textarea
                className="min-h-9 max-w-[486px]"
                placeholder="Write a comment..."
                rows={1}
                {...register("comment")}
              />
              <Button
                className={isSubmitting ? "bg-primary" : ""}
                disabled={isSubmitting}
                type="submit"
              >
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
