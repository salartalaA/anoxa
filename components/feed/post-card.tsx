import { Rss } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/actions/posts";
import { PostActions } from "@/components/feed/post-actions";
import { timeAgo } from "@/lib/utils/time-ago";
import { CreatePostDialog } from "./create-post-dialog";
import PostInteractiveButtons from "./post-interactive-buttons";

export default async function PostCard() {
  const posts = await getPosts();

  if (posts?.length === 0) {
    return (
      <div className="flex animate-fade-up flex-col items-center justify-center px-4 py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Rss className="text-muted-foreground" size={32} />
        </div>
        <h3 className="mb-2 font-semibold text-lg">No posts yet</h3>
        <p className="mb-4 max-w-sm text-muted-foreground">
          Be the first to share something with the community!
        </p>
        <CreatePostDialog />
      </div>
    );
  }

  return posts?.map((post) => (
    <div
      className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200"
      key={post.id}
    >
      <div className="flex flex-col space-y-1.5 p-6 pb-3">
        <div className="flex items-start justify-between">
          <Link className="group flex items-center gap-3" href="/profile/salar">
            <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm">
                {post.author.avatarURL ?? post.author.fullName.charAt(0)}
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

          {/* <ReportPost /> */}
          <PostActions post={post} />
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

      <PostInteractiveButtons />
    </div>
  ));
}
