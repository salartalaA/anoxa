"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

  const caption = watch("caption") ?? "";
  const image = watch("image") ?? "";

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

  const onSubmit = async (newPost: PostData) => {
    await new Promise((resolver) => setTimeout(resolver, 2000));

    setOpenState(false);

    reset();

    toast.success("Post Created Successfully!", {
      position: "top-right",
      className: "bg-card! text-primary!",
      closeButton: true,
    });

    console.log(newPost);
  };

  return (
    <Dialog onOpenChange={setOpenState} open={openState}>
      <form id="create-post-form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger
          render={
            <Button className="h-10 text-white">
              <Plus size={20} />
              Create
            </Button>
          }
        />

        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create post</DialogTitle>
            <DialogDescription>
              Share a photo with other users
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
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
                      form="create-post-form"
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
                  {errors.image?.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                className="mt-2 min-h-[100px] max-w-[452px]"
                form="create-post-form"
                id="caption"
                maxLength={500}
                onChange={(e) => setValue("caption", e.target.value)}
                placeholder="Write a caption..."
              />
              <p className="mt-1 ml-auto text-right text-muted-foreground text-xs">
                {caption.length}/500
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />

            <Button
              className={isSubmitting ? "bg-primary" : ""}
              disabled={!image || isSubmitting}
              form="create-post-form"
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> Creating ...
                </>
              ) : (
                "Create post"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
