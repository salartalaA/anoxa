import { Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/actions/auth";
import { getPosts } from "@/actions/posts";
import { PostActions } from "@/components/feed/post-actions";
import PostInteractiveButtons from "@/components/feed/post-interactive-buttons";
import { ReportPost } from "@/components/feed/report-post";
import Header from "@/components/header";
import { timeAgo } from "@/lib/utils/time-ago";

export default async function BookmarkPage() {
  const posts = await getPosts();

  const currentFullName = (await getCurrentUser())?.fullName;

  // biome-ignore lint/style/noNonNullAssertion: No problem here
  const bookmarkedPosts = posts!.filter((post) => post.isBookmarked);

  return (
    <>
      <Header />

      <div className="mx-auto max-w-2xl p-6">
        <div className="mb-[27px]">
          <div className="mb-2 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/6 bg-white/5">
              <Bookmark className="text-primary" size={16} />
            </div>
            <h1 className="font-bold text-[22px] text-white tracking-tight">
              Bookmarks
            </h1>
          </div>
          <p className="ml-[50px] text-[14px] text-white/40">
            Posts you've saved for later.
          </p>
        </div>

        {bookmarkedPosts.length > 0 ? (
          <div className="space-y-6">
            {bookmarkedPosts.map((post) => (
              <div
                className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200"
                key={post.id}
              >
                <div className="flex flex-col gap-y-1.5 p-6 pb-3">
                  <div className="flex items-start justify-between">
                    <Link
                      className="group flex items-center gap-3"
                      href={`/profile/${post.author.username}`}
                    >
                      <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                        <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm">
                          {post.author.avatarURL ? (
                            <Image
                              alt="user profile"
                              className="rounded-full object-cover"
                              fill
                              src={post.author.avatarURL}
                            />
                          ) : (
                            post.author.fullName.charAt(0)
                          )}
                        </span>
                      </span>
                      <div>
                        <p className="font-semibold text-sm transition-colors group-hover:text-primary">
                          {post.author.fullName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          @{post.author.username} · {timeAgo(post.createdAt)}
                        </p>
                      </div>
                    </Link>

                    {post.isOwner ? (
                      <PostActions post={post} />
                    ) : (
                      <ReportPost postId={post.id} />
                    )}
                  </div>
                </div>
                <div className="p-0">
                  <div className="relative aspect-4/3 bg-muted">
                    <Image alt={post.id} fill src={post.imageURL} />
                  </div>
                  {post.caption && (
                    <div className="border-b px-4 py-5">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {post.caption}
                      </p>
                    </div>
                  )}
                </div>

                <PostInteractiveButtons
                  authorId={post.authorId}
                  comments={post.comments}
                  // biome-ignore lint/style/noNonNullAssertion: No problem here
                  currentFullName={currentFullName!}
                  currentUserAvatar={post.author.avatarURL ?? ""}
                  currentUserReaction={post.currentUserReaction}
                  isBookmarked={post.isBookmarked}
                  postId={post.id}
                  reactionSummery={post.reactionSummary}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/6 bg-white/3">
              <Bookmark className="text-primary" size={26} />
            </div>
            <h2 className="mb-1.5 font-semibold text-[16px] text-white">
              No bookmarks yet
            </h2>
            <p className="max-w-60 text-[13.5px] text-white/40 leading-relaxed">
              Posts you save will appear here.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
