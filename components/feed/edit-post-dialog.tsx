"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { editPost } from "@/actions/posts";
import type { Post } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type PostData, postSchema } from "@/schemas/feed.schema";

interface EditPostDialogProps {
  open: boolean;
  post: Post;
  setOpenState: (open: boolean) => void;
}

export function EditPostDialog({
  open,
  setOpenState,
  post,
}: EditPostDialogProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostData>({
    resolver: zodResolver(postSchema),
  });

  const [preview, setPreview] = useState<string | null>(null);

  const caption = watch("caption") ?? "";
  const image = watch("image");

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);

    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [image]);

  const onSubmit = async (data: PostData) => {
    await editPost({
      id: post.id,
      ...data,
    });

    setOpenState(false);

    reset();

    toast.success("Post Updated Successfully!", {
      position: "top-right",
      className: "bg-card! text-primary!",
      closeButton: true,
    });
  };

  return (
    <Dialog onOpenChange={setOpenState} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit post</DialogTitle>

            <DialogDescription>Update your post information</DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="image">Photo</Label>

              <div
                className="mt-2 overflow-hidden rounded-lg border-2 border-dashed"
                style={{ aspectRatio: "4 / 3" }}
              >
                {preview ? (
                  <div className="relative h-full">
                    <Image
                      alt="Preview"
                      className="object-cover"
                      fill
                      src={preview}
                    />

                    <Button
                      className="absolute top-2 right-2 size-8"
                      disabled={isSubmitting}
                      onClick={() => setValue("image", undefined as never)}
                      size="icon"
                      type="button"
                      variant="secondary"
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <Label
                    className="flex h-full cursor-pointer flex-col items-center justify-center bg-muted/50 transition-colors hover:bg-muted"
                    htmlFor="image"
                  >
                    <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-primary/10">
                      <ImagePlus className="size-8 text-primary" />
                    </div>

                    <span className="font-medium text-sm">Click to upload</span>

                    <span className="mt-1 text-muted-foreground text-xs">
                      PNG and JPG up to 10MB
                    </span>

                    <input
                      accept="image/*"
                      className="hidden"
                      id="image"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (!file) {
                          return;
                        }

                        setValue("image", file);
                      }}
                      type="file"
                    />
                  </Label>
                )}
              </div>

              {errors.image && (
                <p className="mt-1 text-destructive text-sm">
                  {errors.image.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="caption">Caption</Label>

              <Textarea
                className="mt-2 min-h-[100px] max-w-[452px]"
                id="caption"
                maxLength={500}
                onChange={(e) => setValue("caption", e.target.value)}
                placeholder="Write a caption..."
                value={caption}
              />

              <p className="mt-1 text-right text-muted-foreground text-xs">
                {caption.length}/500
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />

            <Button disabled={!image || isSubmitting} type="submit">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Edit post"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
