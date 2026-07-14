"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateProfile } from "@/actions/profile";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type EditProfileData, editProfileSchema } from "@/schemas/auth.schema";

export default function UpdateProfileDialog({
  userId,
  userAvatarURL,
  userFullName,
  userBio,
}: {
  userId: string;
  userAvatarURL: string | null;
  userFullName: string;
  userBio: string | null;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, defaultValues },
  } = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: userFullName,
      bio: userBio ?? "",
    },
  });

  const [openState, setOpenState] = useState(false);

  const bio = watch("bio") ?? "";

  const onSubmit = async (updatedUser: EditProfileData) => {
    await updateProfile(updatedUser, userId);

    setOpenState(false);

    toast.success("Profile updated successfully!", {
      position: "top-right",
      className: "bg-card! text-primary!",
      closeButton: true,
    });
  };

  return (
    <Dialog onOpenChange={setOpenState} open={openState}>
      <DialogTrigger
        render={
          <Button className="w-full bg-transparent py-5" variant="outline">
            <Pencil className="text-foreground/50 transition-colors group-hover:text-foreground/70" />
            Edit Profile
          </Button>
        }
      />

      <DialogContent
        className="max-w-md overflow-hidden rounded-2xl border bg-card p-0 shadow-2xl"
        showCloseButton={false}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="border-border border-b px-6 pt-6 pb-5">
            <DialogTitle className="font-semibold text-[15px] text-foreground tracking-tight">
              Edit Profile
            </DialogTitle>

            <DialogDescription className="sr-only">
              Edit your profile information.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-5 px-6 py-5">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-secondary to-card ring-2 ring-border">
                  {userAvatarURL ? (
                    <Image
                      alt="user profile"
                      className="rounded-full object-cover"
                      fill
                      src={userAvatarURL ?? ""}
                    />
                  ) : (
                    <User className="text-muted-foreground" size={28} />
                  )}
                </div>

                {/* <div className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary ring-2 ring-card">
                  <Camera className="text-primary-foreground" size={12} />
                </div> */}
              </div>
            </div>

            <Field>
              <Label className="font-medium text-[12px] text-white/50 uppercase tracking-wide">
                Avatar URL
              </Label>

              <Input
                className="border-white/8 bg-white/4 px-4 py-5 text-[14px] text-white placeholder:text-white/25 focus-visible:border-blue-500/60 focus-visible:bg-white/6"
                defaultValue={userAvatarURL ?? ""}
                placeholder="https://example.com/avatar.jpg"
                type="url"
                {...register("avatarURL")}
              />
              {errors.avatarURL && (
                <p className="mt-1 text-destructive text-sm">
                  {errors.avatarURL.message}
                </p>
              )}
            </Field>

            <Field>
              <Label className="font-medium text-[12px] text-muted-foreground uppercase tracking-wide">
                Full Name
              </Label>

              <Input
                className="border-input bg-muted/30 px-4 py-5 text-[14px] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-muted/40"
                defaultValue={defaultValues?.fullName}
                {...register("fullName")}
                maxLength={80}
                placeholder="Your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-destructive text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </Field>

            <Field>
              <Label className="font-medium text-[12px] text-muted-foreground uppercase tracking-wide">
                Bio
              </Label>

              <Textarea
                className="resize-none border-input bg-muted/30 px-4 py-5 text-[14px] leading-relaxed placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-muted/40"
                defaultValue={defaultValues?.bio}
                maxLength={240}
                placeholder="Tell us about yourself..."
                {...register("bio")}
                rows={3}
              />

              <p className="text-right text-[11px] text-muted-foreground">
                {bio.length} / 240
              </p>
            </Field>
          </FieldGroup>

          <DialogFooter className="gap-3 px-6 pt-1 pb-6">
            <DialogClose
              render={
                <Button
                  className="rounded-xl px-4 py-2.5 font-medium text-[13px] text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  variant="ghost"
                >
                  Cancel
                </Button>
              }
            />

            <Button
              className="px-5 py-2.5 font-semibold text-[13px] shadow-lg"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-x-1">
                  <Loader2 className="animate-spin" size={16} />
                  Saving ...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
