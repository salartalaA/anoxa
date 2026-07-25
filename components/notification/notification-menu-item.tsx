import Image from "next/image";
import { useRouter } from "next/navigation";
import { type RefObject, useEffect, useRef } from "react";
import {
  type getNotification,
  updateNotificationIsRead,
} from "@/actions/notification";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils/time-ago";

const REACTIONS = {
  HEART: "❤️",
  LAUGH: "😁",
  LIKE: "👍",
  DISLIKE: "👎",
};

type NoArray<T> = T extends (infer U)[] ? U : never;

export default function NotificationMenuItem({
  notif,
  root,
}: {
  notif: NoArray<Awaited<ReturnType<typeof getNotification>>>;
  root: RefObject<HTMLDivElement | null>;
}) {
  const notifRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (notif.isRead) {
      return;
    }
    if (!(notifRef.current && root.current)) {
      return;
    }

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }
        await updateNotificationIsRead(notif.id);

        observer.unobserve(entry.target);
      },
      {
        root: root.current,
        threshold: 1,
      }
    );

    observer.observe(notifRef.current);

    return () => observer.disconnect();
  }, [notif, root]);

  const URL =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/#${notif.postId}`
      : `https://anoxa.vercel.app/#${notif.postId}`;

  return (
    <DropdownMenuItem
      className={cn(
        "cursor-pointer rounded-lg p-3 transition-colors focus:bg-muted",
        notif.isRead ? "opacity-70" : ""
      )}
      onClick={() => router.push(URL)}
      ref={notifRef}
    >
      <div className="flex items-start gap-3">
        <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
          {notif.sender.avatarURL ? (
            <Image
              alt="user profile"
              className="rounded-full object-cover"
              fill
              src={notif.sender.avatarURL}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs">
              {notif.sender.fullName.charAt(0)}
            </span>
          )}
        </span>

        <div className="flex flex-col gap-1">
          {notif.reactionType && (
            <p className="text-sm leading-relaxed">
              <span className="font-semibold">{notif.sender.fullName}</span>{" "}
              reacted {REACTIONS[notif.reactionType]} to your post
            </p>
          )}

          {notif.type === "COMMENT" && (
            <p className="text-sm leading-relaxed">
              <span className="font-semibold">{notif.sender.fullName}</span>{" "}
              commented on your post
            </p>
          )}

          <span className="text-muted-foreground text-xs">
            {timeAgo(notif.createdAt)}
          </span>
        </div>
      </div>
    </DropdownMenuItem>
  );
}
