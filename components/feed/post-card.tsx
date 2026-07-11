import Image from "next/image";
import Link from "next/link";
import { PostActions } from "@/components/feed/post-actions";
import PostInteractiveButtons from "./post-interactive-buttons";

export default function PostCard() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200">
      <div className="flex flex-col space-y-1.5 p-6 pb-3">
        <div className="flex items-start justify-between">
          <Link className="group flex items-center gap-3" href="/profile/salar">
            <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm">
                S
              </span>
            </span>
            <div>
              <p className="font-semibold text-sm transition-colors group-hover:text-primary">
                Salar
              </p>
              <p className="text-muted-foreground text-xs">@salar · 6d ago</p>
            </div>
          </Link>

          {/* <ReportPost /> */}
          <PostActions />
        </div>
      </div>
      <div className="p-0">
        <div className="relative aspect-4/3 bg-muted">
          <Image
            alt="gamepad-logo"
            fill
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-syqqyOxYTf2vgGosoCv1y7Gl5_mx1F_RXAvh2BEDBx-gyjGbelvZZdIt&s=10"
          />
        </div>
        <div className="px-4 py-3">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">test</p>
        </div>
      </div>

      <PostInteractiveButtons />
    </div>
  );
}
