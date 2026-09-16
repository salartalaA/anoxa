"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { requireActiveUser } from "@/actions/auth";
import { createPost } from "@/actions/posts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type PostData, postSchema } from "@/schemas/feed.schema";

export function CreatePostDialog() {
  const {
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostData>({
    resolver: zodResolver(postSchema),
  });

  const [openState, setOpenState] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const caption = watch("caption") ?? "";
  const image = watch("image") ?? "";

  const validDimension =
    (dimensions?.width as number) <= 503 &&
    (dimensions?.height as number) <= 502;

  useEffect(() => {
    if (!image) {
      setPreview(null);
      setDimensions(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image as unknown as Blob);
    setPreview(objectUrl);

    const img = new window.Image();
    img.src = objectUrl;
    img.onload = () => {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      console.log(
        `Image Dimensions: ${img.naturalWidth} x ${img.naturalHeight}`
      );
    };

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [image]);

  const onSubmit = async (newPost: PostData) => {
    const result = await requireActiveUser();

    if (!result.success && result.message) {
      return toast.info(result.message, {
        position: "top-right",
        className: "bg-card! text-warning!",
        closeButton: true,
      });
    }

    await createPost(newPost);

    setOpenState(false);
    reset();
    setDimensions(null);

    toast.success("Post Created Successfully!", {
      position: "top-right",
      className: "bg-card! text-primary!",
      closeButton: true,
    });
  };

  return (
    <Dialog onOpenChange={setOpenState} open={openState}>
      <DialogTrigger
        render={
          <Button className="h-10 text-white">
            <Plus size={20} />
            Create
          </Button>
        }
      />

      <DialogContent className="sm:max-w-[500px]">
        <form id="create-post-form" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create post</DialogTitle>
            <DialogDescription>
              Share a photo with other users
            </DialogDescription>
            <span className="text-warning">Max file size: 10MB</span>
            <span className="text-warning">
              Vaild Image Size: 503px X 502px (or less)
            </span>
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

                    {dimensions && (
                      <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-white text-xs backdrop-blur-xs">
                        {dimensions.width} × {dimensions.height} px
                      </div>
                    )}

                    <Button
                      className="absolute top-2 right-2 size-8"
                      disabled={isSubmitting}
                      onClick={() => {
                        setValue("image", undefined as never);
                        setDimensions(null);
                      }}
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
              />

              {errors.caption && (
                <p className="mt-1 text-destructive text-sm">
                  {errors.caption.message}
                </p>
              )}

              <p className="mt-1 ml-auto text-right text-muted-foreground text-xs">
                {caption.length}/500
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />

            <Button
              className={isSubmitting ? "bg-primary" : ""}
              disabled={!image || isSubmitting || !caption || !validDimension}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create post"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
