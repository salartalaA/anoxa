"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { CreatePostDialog } from "./create-post-dialog";

export default function FeedHeader() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-bold text-2xl">Feed</h1>
        <p className="text-muted-foreground text-sm">
          See what people are sharing
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          className="h-10 transition-opacity disabled:opacity-60"
          disabled={isPending}
          onClick={handleRefresh}
          variant="outline"
        >
          <RefreshCw className={isPending ? "animate-spin" : ""} size={20} />
          {isPending ? "Refreshing..." : "Refresh"}
        </Button>

        <CreatePostDialog />
      </div>
    </div>
  );
}
