"use client";

import { Bell } from "lucide-react";
import { useRef } from "react";
import type { getNotification } from "@/actions/notification";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import NotificationMenuItem from "./notification-menu-item";

export default function NotificationDropDown({
  notification,
}: {
  notification: Awaited<ReturnType<typeof getNotification>> | undefined;
}) {
  const isNotificationRead = notification?.every((notif) => notif.isRead);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        render={
          <div className="relative flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted">
            <Bell size={18} />
            {!isNotificationRead && (
              <span className="absolute top-1 right-1 size-2 rounded-full bg-primary" />
            )}
          </div>
        }
      />

      <DropdownMenuContent
        align="end"
        className="w-80 rounded-xl p-2"
        ref={scrollAreaRef}
      >
        <div className="mb-2 px-2 py-1.5">
          <h3 className="font-semibold text-sm">Notifications</h3>
        </div>

        <ScrollArea className="h-66">
          {notification && notification.length > 0 ? (
            notification.map((notif) => (
              <NotificationMenuItem
                key={notif.id}
                notif={notif}
                root={scrollAreaRef}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                🔔
              </div>

              <p className="font-medium text-sm">No notifications yet</p>

              <p className="text-muted-foreground text-xs">
                You're all caught up!
              </p>
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
