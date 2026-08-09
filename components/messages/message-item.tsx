import { Check, CheckCheck, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { type Dispatch, type SetStateAction, useEffect, useRef } from "react";
import type { Message } from "@/app/generated/prisma/client";
import { socket } from "@/lib/socket";
import { cn } from "@/lib/utils";

export default function MessageItem({
  message,
  currentUserId,
  otherUserFullName,
  setIsEditing,
  setMessage,

  // isEditing,
  // editingMessageId,

  setEditingMessageId,
  otherUserAvatarURL,
}: {
  message: Message;
  currentUserId: string;
  otherUserFullName: string;

  isEditing: boolean;
  editingMessageId: string | null;

  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setEditingMessageId: Dispatch<SetStateAction<string | null>>;
  setMessage: Dispatch<SetStateAction<string>>;
  otherUserAvatarURL: string | null;
}) {
  const messageRef = useRef<HTMLDivElement | null>(null);

  const hasReportedSeenRef = useRef(false);

  const isMine = message.senderId === currentUserId;

  useEffect(() => {
    const element = messageRef.current;

    if (!element) {
      return;
    }

    if (isMine) {
      return;
    }

    if (message.seenAt) {
      return;
    }

    if (hasReportedSeenRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        if (hasReportedSeenRef.current) {
          return;
        }

        hasReportedSeenRef.current = true;

        socket.emit("message-seen", {
          messageId: message.id,
        });

        observer.disconnect();
      },
      {
        threshold: 0.8,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [message.id, message.seenAt, isMine]);

  const time = new Date(message.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handleDeleteMessage = (messageId: string) => {
    socket.emit("delete-message", {
      messageId,
    });
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditingMessageId(message.id);
    setMessage(message.text);
  };

  return (
    <div
      className={cn(
        "group mt-2.5 flex animate-message-in items-end gap-2.5",
        isMine ? "justify-end" : "justify-start"
      )}
      ref={messageRef}
    >
      {!isMine && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-semibold text-foreground text-xs">
          {otherUserAvatarURL ? (
            <Image
              alt="user profile"
              className="size-8 rounded-full object-cover"
              height={32}
              src={otherUserAvatarURL}
              width={32}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs">
              {otherUserFullName.charAt(0)}
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "relative flex max-w-[70%] flex-col",
          isMine && "items-end"
        )}
      >
        <div
          className={cn(
            "relative rounded-2xl px-4 py-2.5 text-sm shadow-sm",
            isMine && "pr-9",
            isMine
              ? "rounded-br-md bg-primary text-secondary-foreground"
              : "rounded-bl-md bg-secondary text-secondary-foreground"
          )}
        >
          <span className="wrap-break-words whitespace-pre-wrap">
            {message.text}
          </span>

          {isMine && (
            <span
              className={cn(
                "absolute right-2 bottom-1.5 flex items-center",
                message.seenAt ? "text-accent" : "text-foreground"
              )}
            >
              {message.seenAt ? (
                <CheckCheck className="size-4" strokeWidth={2.5} />
              ) : (
                <Check className="size-4" strokeWidth={2.5} />
              )}
            </span>
          )}
        </div>

        {isMine && (
          <div className="absolute right-12 bottom-1 hidden w-fit items-center gap-2 bg-background text-sm group-hover:flex">
            <button onClick={handleStartEdit} type="button">
              <Pencil
                className={cn("text-primary", isMine ? "ml-auto" : "mr-auto")}
                size={10}
              />
            </button>

            <button
              onClick={() => handleDeleteMessage(message.id)}
              type="button"
            >
              <Trash2
                className={cn(
                  "text-destructive",
                  isMine ? "ml-auto" : "mr-auto"
                )}
                size={10}
              />
            </button>
          </div>
        )}

        <div className="mt-1 flex items-center gap-1.5 px-1">
          <span className="text-muted-foreground text-xs">{time}</span>
          {message.isEdited && (
            <span className="text-muted-foreground text-xs">. edited</span>
          )}
        </div>
      </div>
    </div>
  );
}
