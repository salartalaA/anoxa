import { BadgeCheck, Calendar, ChevronLeft, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { getProfile, getProfileStats } from "@/actions/profile";
import DeleteAccountDialog from "@/components/profile/delete-account-dialog";
import UpdateProfileDialog from "@/components/profile/update-profile-dialog";
import { Button } from "@/components/ui/button";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const userProfile = await getProfile(username);

  const currentUser = await getCurrentUser();

  if (!userProfile) {
    return redirect("/");
  }

  const stats = await getProfileStats(userProfile.id);

  // biome-ignore lint/style/noNonNullAssertion: No problem here
  const isOwner = currentUser!.id === userProfile.id;

  const joinedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(userProfile.createdAt);

  return (
    <>
      <Button className={"max-lg:m-5 lg:hidden"} variant={"outline"}>
        <Link className="flex items-center gap-1 text-foreground" href={"/"}>
          <ChevronLeft /> Home
        </Link>
      </Button>

      <div className="flex min-h-screen flex-col items-center justify-center max-md:mx-5 max-lg:-mt-19">
        <div className="relative w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border border-white/6 bg-card shadow-2xl shadow-black/50">
            <div className="flex flex-col items-center px-8 pt-10 pb-6 text-center">
              <div className="relative mb-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-card/10 shadow-xl ring-[3px] ring-white/10">
                  {/* <User className="text-foreground/25" size={32} /> */}
                  {userProfile.avatarURL ? (
                    <Image
                      alt="user profile"
                      className="rounded-full object-cover"
                      fill
                      src={userProfile.avatarURL ?? ""}
                    />
                  ) : (
                    <User className="text-muted-foreground" size={28} />
                  )}
                </div>
              </div>
              <div className="mb-2 flex items-center gap-1.5">
                <h1 className="font-bold text-[18px] text-foreground leading-none tracking-tight">
                  {userProfile.fullName}
                </h1>
                {userProfile.isVerified && (
                  <BadgeCheck className="text-primary" />
                )}
              </div>

              <p className="mb-1 text-muted-foreground text-xs">
                @{userProfile.username}
                {userProfile.role !== "USER" && (
                  <span className="lowercase"> . {userProfile.role}</span>
                )}
              </p>

              {userProfile.bio && (
                <p className="mb-4 max-w-[260px] text-[13.5px] text-primary leading-relaxed">
                  {userProfile.bio}
                </p>
              )}

              <div className="flex items-center gap-1.5 text-foreground/30">
                <Calendar size={16} />
                <span className="text-[12px]">Joined {joinedDate}</span>
              </div>
            </div>
            <div className="mx-6 h-px bg-white/5" />

            <div className="grid grid-cols-3 divide-x divide-white/5 px-0 py-6">
              <div className="flex flex-col items-center gap-1 px-4">
                <span className="font-bold text-[22px] text-foreground tabular-nums leading-none tracking-tight">
                  {stats.posts}
                </span>
                <span className="text-center font-medium text-[11px] text-foreground/35 tracking-wide">
                  Posts
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 px-4">
                <span className="font-bold text-[22px] text-foreground tabular-nums leading-none tracking-tight">
                  {stats.comments}
                </span>
                <span className="text-center font-medium text-[11px] text-foreground/35 tracking-wide">
                  Comments Recieved
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 px-4">
                <span className="font-bold text-[22px] text-foreground tabular-nums leading-none tracking-tight">
                  {stats.reactions}
                </span>
                <span className="text-center font-medium text-[11px] text-foreground/35 tracking-wide">
                  Reactions Recieved
                </span>
              </div>
            </div>

            <div className="mx-6 h-px bg-white/5" />

            {isOwner && (
              <div className="space-y-3 px-6 py-5">
                <UpdateProfileDialog
                  userAvatarURL={userProfile.avatarURL}
                  userBio={userProfile.bio}
                  userFullName={userProfile.fullName}
                  userId={userProfile.id}
                />
                <DeleteAccountDialog userId={userProfile.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
