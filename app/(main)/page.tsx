import FeedHeader from "@/components/feed/feed-header";
import PostCard from "@/components/feed/post-card";
import Header from "@/components/header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <FeedHeader />

          <div className="space-y-6">
            {/* TODO: What if we don't have any posts? */}
            {/* TODO: What when we're at loading? */}

            <PostCard />
          </div>
        </div>
      </main>
    </>
  );
}
