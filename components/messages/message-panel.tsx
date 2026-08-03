import { Send, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { ConversationItem } from "@/app/(main)/messages/page";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

interface Message {
  content: string;
  id: string;
  isMine: boolean;
  status: "sent" | "delivered" | "seen" | null;
  time: string;
}

interface MessageGroup {
  date: string;
  messages: Message[];
}

export default function MessagePanel({
  activeConversation,
  setPanelOpenState,
  setActiveConversation,
}: {
  activeConversation: ConversationItem;
  setActiveConversation: Dispatch<SetStateAction<ConversationItem | null>>;
  setPanelOpenState: Dispatch<SetStateAction<boolean>>;
}) {
  const messageGroups: MessageGroup[] = [
    {
      date: "Yesterday",
      messages: [
        {
          id: "1",
          content: "Hey, are you coming to the briefing tomorrow?",
          time: "09:14",
          isMine: false,
          status: null,
        },
        {
          id: "2",
          content: "Yes, I will be there. What time does it start?",
          time: "09:16",
          isMine: true,
          status: "seen",
        },
        {
          id: "3",
          content: "0800 sharp. Erwin wants everyone early.",
          time: "09:17",
          isMine: false,
          status: null,
        },
        {
          id: "4",
          content: "Got it. I will bring the maps we printed.",
          time: "09:20",
          isMine: true,
          status: "seen",
        },
      ],
    },
    {
      date: "Today",
      messages: [
        {
          id: "5",
          content: "Perfect. See you tomorrow at the training grounds.",
          time: "10:02",
          isMine: false,
          status: null,
        },
        {
          id: "6",
          content: "Also, Mikasa asked me to tell you to bring your gear.",
          time: "10:03",
          isMine: false,
          status: null,
        },
        {
          id: "7",
          content: "Sure, everything is packed already.",
          time: "10:05",
          isMine: true,
          status: "delivered",
        },
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-border/50 border-b px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full font-semibold text-sm text-white"
              //   style={{ backgroundColor: activeConversation.avatarColor }}
            >
              {activeConversation.fullName.charAt(0)}
            </div>

            {/* {activeConversation.isOnline && (
              <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-card bg-success" />
            )} */}

            <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-card bg-success" />
          </div>

          <div>
            <p className="font-semibold text-foreground text-sm">
              {activeConversation.fullName}
            </p>

            <div className="flex items-center gap-1.5">
              <p className="text-muted-foreground text-xs">
                {/* {activeConversation.isOnline ? "Online" : "Offline"} */}
                Online
              </p>
            </div>
          </div>
        </div>

        <Button
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {
            setPanelOpenState(false);
            setActiveConversation(null);
          }}
          size="icon"
          variant="ghost"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="scrollbar-thin flex-1">
        <div className="space-y-1 px-5 py-6">
          {messageGroups.map((group) => (
            <div key={group.date}>
              <div className="flex items-center justify-center py-3">
                <span className="rounded-full bg-muted/60 px-3 py-1 font-medium text-muted-foreground text-xs">
                  {group.date}
                </span>
              </div>

              <div className="space-y-1">
                {group.messages.map((message) => (
                  <div
                    className={cn(
                      "flex animate-message-in items-end gap-2.5",
                      message.isMine ? "justify-end" : "justify-start"
                    )}
                    key={message.id}
                  >
                    {!message.isMine && (
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold text-white text-xs"
                        // style={{
                        //   backgroundColor: activeConversation.avatarColor,
                        // }}
                      >
                        {/* {activeConversation.initials} */}
                      </div>
                    )}

                    <div
                      className={cn(
                        "flex max-w-[70%] flex-col",
                        message.isMine && "items-end"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                          message.isMine
                            ? "rounded-br-md bg-primary text-primary-foreground"
                            : "rounded-bl-md bg-secondary text-secondary-foreground"
                        )}
                      >
                        {message.content}
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 px-1">
                        <span className="text-muted-foreground text-xs">
                          {message.time}
                        </span>

                        {message.isMine && message.status && (
                          <span className="text-muted-foreground/70 text-xs capitalize">
                            · {message.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-border/50 border-t px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Input
            className="flex-1 bg-background/50"
            placeholder="Type a message..."
          />

          <Button className="h-10 w-10 shrink-0" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
