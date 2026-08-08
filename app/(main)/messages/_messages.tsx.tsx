"use client";

import { MessageCircle, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Message } from "@/app/generated/prisma/client";
import MessagePanel from "@/components/messages/message-panel";
import SendMessageDialog, {
  type CustomUser,
} from "@/components/messages/send-message-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { socket } from "@/lib/socket";
import { cn } from "@/lib/utils";

export interface OldMessages {
  conversationId: string;
  oldMessages: Message[];
}

export interface Conversation {
  avatarURL: string | null;
  conversationId: string;
  fullName: string;
  id: string;
  lastMessage: Message | null;
  lastMessageAt: Date | null;
  lastSeen: Date | null;
  unreadCount: number | null;
  username: string;
}

export default function MessagesPage({
  activeUsers,
  currentUserId,
  chats,
}: {
  activeUsers: CustomUser[];
  currentUserId: string;
  chats: Conversation[];
}) {
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);

  const [panelOpenState, setPanelOpenState] = useState(false);

  const [message, setMessage] = useState("");

  const [oldMessages, setOldMessages] = useState<OldMessages>();

  const [conversationId, setConversationId] = useState("");

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const [lastSeen, setLastSeen] = useState<Record<string, Date>>({});

  const [isTyping, setIsTyping] = useState(false);

  // console.log("ALL ONLINE USERS: ", onlineUsers);

  useEffect(() => {
    socket.connect();

    // socket.on("connect", () => {
    //   console.log("Socket connected: ", socket.id);
    // });

    socket.on("online-users", ({ users }) => {
      setOnlineUsers(users);
    });

    socket.on("old-messages", (oldMessages: OldMessages) => {
      setOldMessages(oldMessages);
      setConversationId(oldMessages.conversationId);
    });

    socket.on("user-online", (userId) => {
      // console.log("Online: ", userId);
      setOnlineUsers((prev) => [...prev, userId]);
    });

    socket.on("user-offline", ({ userId, lastSeen }) => {
      // console.log("Offline: ", userId);
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
      setLastSeen((prev) => ({ ...prev, [userId]: new Date(lastSeen) }));
    });

    return () => {
      socket.off("connect");
      socket.off("user-online");
      socket.off("user-offline");
    };
  }, []);

  const handleOpenchat = (conversation: Conversation) => {
    const getChat = chats.find((chat) => chat.id === conversation.id);

    if (!getChat) {
      return;
    }

    socket.emit("open-chat", {
      currentUserId,
      otherUserId: conversation.id,
    });

    setActiveConversation(getChat);
    setPanelOpenState(true);
    setMessage("");
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
                    activeUsers={activeUsers}
                    currentUserId={currentUserId}
                    setActiveConversation={setActiveConversation}
                    setMessage={setMessage}
                    setPanelOpenState={setPanelOpenState}
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
                    {chats.map((chat) => {
                      const time = chat.lastMessageAt
                        ? new Date(chat.lastMessageAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )
                        : "";

                      const isOnline = onlineUsers.includes(chat.id);

                      return (
                        <Button
                          className={cn(
                            "group relative flex w-full items-center gap-3 rounded-xl px-3 py-7 text-left transition-all duration-200 hover:bg-accent/60",
                            activeConversation?.id === chat.id &&
                              "bg-primary/10"
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
                              {chat.avatarURL ? (
                                <Image
                                  alt="user profile"
                                  className="rounded-full object-cover"
                                  fill
                                  src={chat.avatarURL}
                                />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs">
                                  {chat.fullName.charAt(0)}
                                </span>
                              )}
                            </div>

                            {isOnline && (
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
                                {time}
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
                                {chat.lastMessage?.text}
                              </p>

                              {chat.unreadCount !== null && (
                                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 font-semibold text-foreground text-xs">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </Button>
                      );
                    })}
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
              conversationId={conversationId}
              currentUserId={currentUserId}
              isTyping={isTyping}
              // biome-ignore lint/style/noNonNullAssertion: No problem here
              lastSeen={lastSeen!}
              message={message}
              oldMessages={oldMessages}
              onlineUsers={onlineUsers}
              otherUserId={activeConversation.id}
              setActiveConversation={setActiveConversation}
              setIsTyping={setIsTyping}
              setMessage={setMessage}
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
