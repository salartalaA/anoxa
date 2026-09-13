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
    <div className="flex flex-col justify-between lg:flex-row lg:items-center">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h1 className="font-bold text-2xl">Feed</h1>
          <div className="flex gap-2 lg:hidden">
            <Button
              className="h-10 transition-opacity disabled:opacity-60"
              disabled={isPending}
              onClick={handleRefresh}
              variant="outline"
            >
              <RefreshCw
                className={isPending ? "animate-spin" : ""}
                size={20}
              />
              {isPending ? "Refreshing..." : "Refresh"}
            </Button>

            <CreatePostDialog />
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          See what people are sharing
        </p>
      </div>

      <div className="hidden gap-2 lg:flex">
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
