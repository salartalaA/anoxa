import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { CreatePostDialog } from "./create-post-dialog";

export default function FeedHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-bold text-2xl">Feed</h1>
        <p className="text-muted-foreground text-sm">
          See what people are sharing
        </p>
      </div>
      <div className="flex gap-2">
        <Button className="h-10" variant="outline">
          <RefreshCw size={20} />
          Refresh
        </Button>

        <CreatePostDialog />
      </div>
    </div>
  );
}
