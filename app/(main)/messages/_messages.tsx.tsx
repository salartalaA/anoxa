"use client";

import { MessageCircle, Search } from "lucide-react";
import { useState } from "react";
import type { User } from "@/app/generated/prisma/client";
import MessagePanel from "@/components/messages/message-panel";
import SendMessageDialog from "@/components/messages/send-message-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ConversationItem } from "./page";

export default function MessagesPage({
  activeUsers,
}: {
  activeUsers: Omit<User, "password">[];
}) {
  const [activeConversation, setActiveConversation] =
    useState<ConversationItem | null>(null);

  const [panelOpenState, setPanelOpenState] = useState(false);

  const chats: ConversationItem[] = [
    {
      id: 1,
      fullName: "Eren Yeager",
      lastMessage: "See you tomorrow at the training grounds...",
      lastMessageAt: "2m ago",
      isOnline: true,
      unreadCount: 3,
    },
    {
      id: 2,
      fullName: "Mikasa Ackerman",
      lastMessage: "The scarf looks great, thank you.",
      lastMessageAt: "12m ago",
      isOnline: true,
      unreadCount: 1,
    },
    {
      id: 3,
      fullName: "Armin Arlert",
      lastMessage: "I found something interesting in the archives.",
      lastMessageAt: "1h ago",
      isOnline: false,
      unreadCount: null,
    },
    {
      id: 4,
      fullName: "Levi Ackerman",
      lastMessage: "Clean the barracks before inspection.",
      lastMessageAt: "3h ago",
      isOnline: false,
      unreadCount: null,
    },
    {
      id: 5,
      fullName: "Hange Zoe",
      lastMessage: "The new experiment results are fascinating!",
      lastMessageAt: "5h ago",
      isOnline: true,
      unreadCount: 7,
    },
    {
      id: 6,
      fullName: "Erwin Smith",
      lastMessage: "Dedicate your heart.",
      lastMessageAt: "1d ago",
      isOnline: false,
      unreadCount: null,
    },
    {
      id: 7,
      fullName: "Sasha Blouse",
      lastMessage: "Do we have any more of that bread?",
      lastMessageAt: "2d ago",
      isOnline: false,
      unreadCount: null,
    },
    {
      id: 8,
      fullName: "Jean Kirstein",
      lastMessage: "See you at the mess hall.",
      lastMessageAt: "3d ago",
      isOnline: false,
      unreadCount: null,
    },
    {
      id: 9,
      fullName: "Connie Springer",
      lastMessage: "That was hilarious, you should have seen it.",
      lastMessageAt: "4d ago",
      isOnline: false,
      unreadCount: null,
    },
    {
      id: 10,
      fullName: "Historia Reiss",
      lastMessage: "The ceremony is next week.",
      lastMessageAt: "5d ago",
      isOnline: false,
      unreadCount: null,
    },
    {
      id: 11,
      fullName: "Reiner Braun",
      lastMessage: "We need to talk.",
      lastMessageAt: "1w ago",
      isOnline: false,
      unreadCount: null,
    },
    {
      id: 12,
      fullName: "Annie Leonhart",
      lastMessage: "...",
      lastMessageAt: "2w ago",
      isOnline: false,
      unreadCount: null,
    },
  ];

  const handleOpenchat = (conversation: ConversationItem) => {
    const getChat = chats.find((chat) => chat.id === conversation.id);

    if (!getChat) {
      return;
    }

    setActiveConversation(getChat);
    setPanelOpenState(true);
  };

  return (
    <div className="mx-auto min-h-screen max-w-[1400px] py-6 lg:py-8">
      <div className="my-5 hidden gap-5 md:grid md:grid-cols-[35fr_65fr] lg:grid-cols-[30fr_70fr]">
        <div className="glass-card h-[calc(100vh-7rem)] rounded-xl border border-border/60 shadow-lg">
          <div className="h-full p-4">
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-3 px-1 pb-5">
                <div>
                  <h1 className="font-semibold text-foreground text-xl tracking-tight">
                    Messages
                  </h1>
                  <p className="mt-0.5 text-muted-foreground text-sm">
                    Private conversations
                  </p>
                </div>

                {activeUsers && (
                  <SendMessageDialog
                    setActiveConversation={setActiveConversation}
                    setPanelOpenState={setPanelOpenState}
                    users={activeUsers}
                  />
                )}
              </div>
              <div className="relative px-1">
                <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="Search conversations ..."
                  type="text"
                />
              </div>
              <ScrollArea className="relative mt-4 flex-1 overflow-hidden px-1">
                <div className="h-full w-full">
                  <div className="space-y-1 pr-2">
                    {chats.map((chat) => (
                      <Button
                        className={cn(
                          "group relative flex w-full items-center gap-3 rounded-xl px-3 py-7 text-left transition-all duration-200 hover:bg-accent/60",
                          activeConversation?.id === chat.id && "bg-primary/10"
                        )}
                        key={chat.id}
                        onClick={() => handleOpenchat(chat)}
                        variant="ghost"
                      >
                        {activeConversation?.id === chat.id && (
                          <span className="absolute top-1/2 left-0 h-7 -translate-y-1/2 rounded-r-full border-primary border-l-2" />
                        )}

                        <div className="relative shrink-0">
                          <div
                            className="flex h-11 w-11 items-center justify-center rounded-full font-semibold text-sm text-white"
                            // style={{ backgroundColor: chat.avatarColor }}
                          >
                            {chat.fullName.charAt(0)}
                          </div>

                          {chat.isOnline && (
                            <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-card bg-success" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={cn(
                                "truncate text-sm",
                                chat.unreadCount
                                  ? "font-semibold text-foreground"
                                  : "font-medium text-foreground"
                              )}
                            >
                              {chat.fullName}
                            </p>

                            <span className="shrink-0 text-muted-foreground text-xs">
                              {chat.lastMessageAt}
                            </span>
                          </div>

                          <div className="mt-0.5 flex items-center justify-between gap-2">
                            <p
                              className={cn(
                                "truncate text-xs",
                                chat.unreadCount
                                  ? "font-medium text-foreground/80"
                                  : "text-muted-foreground"
                              )}
                            >
                              {chat.lastMessage}
                            </p>

                            {chat.unreadCount !== null && (
                              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 font-semibold text-foreground text-xs">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
              <div className="border-border/50 border-t px-4 py-3">
                <p className="text-muted-foreground text-xs">
                  {chats.length} Conversations
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card h-[calc(100vh-7rem)] rounded-xl border border-border/60 shadow-lg">
          {activeConversation && panelOpenState ? (
            <MessagePanel
              activeConversation={activeConversation}
              setActiveConversation={setActiveConversation}
              setPanelOpenState={setPanelOpenState}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl" />
                <MessageCircle className="text-primary" size={40} />
              </div>
              <h2 className="mt-6 font-semibold text-foreground text-lg">
                No conversation selected
              </h2>
              <p className="mt-1.5 text-muted-foreground text-sm">
                Choose a conversation or start a new one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
