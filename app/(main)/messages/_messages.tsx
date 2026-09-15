"use client";

import { Check, CheckCheck, MessageCircle, Search } from "lucide-react";
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
import { connectSocket, socket } from "@/lib/socket";
import { cn } from "@/lib/utils";

export interface OldMessages {
  conversationId: string;
  oldMessages: Message[];
}

export interface Conversation {
  avatarURL: string | null;
  conversationId: string;

  currentUserId: string;
  fullName: string;
  id: string;
  lastMessage: Message | null;
  lastMessageAt: Date | null;
  lastSeen: Date | null;
  unreadCount: number;
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

  const [conversationList, setConversationList] =
    useState<Conversation[]>(chats);

  const [searchQuery, setSearchQuery] = useState("");

  // console.log("ALL ONLINE USERS: ", onlineUsers);

  useEffect(() => {
    connectSocket();

    return () => {
      socket.disconnect();
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally omitted dependencies
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

    socket.on(
      "conversation-updated",
      ({
        conversationId,
        lastMessage,
        unreadCount,
        otherUser,
      }: {
        conversationId: string;
        lastMessage: Message | null;
        unreadCount: number;
        otherUser: {
          id: string;
          fullName: string;
          username: string;
          avatarURL: string | null;
          lastSeen: Date | null;
        };
      }) => {
        setConversationList((prev) => {
          const existing = prev.find(
            (chat) => chat.conversationId === conversationId
          );

          if (!existing && otherUser) {
            const newConversation: Conversation = {
              conversationId,
              currentUserId,
              id: otherUser.id,
              fullName: otherUser.fullName,
              username: otherUser.username,
              avatarURL: otherUser.avatarURL,
              lastSeen: otherUser.lastSeen,
              lastMessage,
              lastMessageAt: lastMessage?.createdAt ?? null,
              unreadCount,
            };

            return [newConversation, ...prev];
          }

          if (!lastMessage) {
            return prev.filter(
              (chat) => chat.conversationId !== conversationId
            );
          }

          return prev.map((chat) => {
            if (chat.conversationId !== conversationId) {
              return chat;
            }

            return {
              ...chat,
              lastMessage,
              lastMessageAt: lastMessage.createdAt,
              // unreadCount:
              //   activeConversation?.conversationId === conversationId
              //     ? 0
              //     : unreadCount,

              unreadCount: unreadCount ?? chat.unreadCount,
            };
          });
        });
      }
    );

    // socket.on("message-deleted", ({ messageId }) => {
    //   setOldMessages((prev: OldMessages | undefined) => {
    //     if (!prev) {
    //       return prev;
    //     }

    //     return {
    //       ...prev,
    //       oldMessages: prev.oldMessages.filter(
    //         (message) => message.id !== messageId
    //       ),
    //     };
    //   });
    // });

    socket.on(
      "message-seen",
      ({
        conversationId,
        messageId,
        seenAt,
      }: {
        conversationId: string;
        messageId: string;
        seenAt: string;
      }) => {
        setConversationList((prev) =>
          prev.map((chat) => {
            if (chat.conversationId !== conversationId) {
              return chat;
            }

            if (!chat.lastMessage) {
              return chat;
            }

            if (chat.lastMessage.id !== messageId) {
              return chat;
            }

            return {
              ...chat,
              lastMessage: {
                ...chat.lastMessage,
                seenAt: new Date(seenAt),
              },
            };
          })
        );
      }
    );

    return () => {
      socket.off("connect");
      socket.off("user-online");
      socket.off("user-offline");
      socket.off("conversation-updated");
      socket.off("message-seen");
    };
  }, []);

  const handleOpenchat = (conversation: Conversation) => {
    const getChat = conversationList.find(
      (chat) => chat.id === conversation.id
    );

    if (!getChat) {
      return;
    }

    socket.emit("open-chat", {
      currentUserId,
      otherUserId: conversation.id,
    });

    setActiveConversation({
      ...getChat,
      unreadCount: 0,
    });

    setConversationList((prev) =>
      prev.map((chat) =>
        chat.conversationId === getChat.conversationId
          ? {
              ...chat,
              unreadCount: 0,
            }
          : chat
      )
    );

    setPanelOpenState(true);
    setMessage("");
  };

  const filteredConversations = conversationList.filter((chat) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return chat.fullName.toLowerCase().includes(query);
  });

  return (
    <div className="mx-auto min-h-screen max-w-[1400px] px-4 py-6 lg:py-8">
      <div className="my-5 grid gap-5 md:grid-cols-[35fr_65fr] lg:grid-cols-[30fr_70fr]">
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations ..."
                  type="text"
                />
              </div>
              <ScrollArea className="relative mt-4 flex-1 overflow-hidden px-1">
                <div className="h-full w-full">
                  <div className="space-y-1 pr-2">
                    {conversationList.length ? (
                      // biome-ignore lint/style/noNestedTernary: intentional nested ternary
                      filteredConversations.length ? (
                        // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: intentional complexity
                        filteredConversations.map((chat) => {
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
                                  <div
                                    className={cn(
                                      "flex w-full items-center gap-2 text-xs",
                                      chat.unreadCount
                                        ? "font-medium text-foreground/80"
                                        : "text-muted-foreground"
                                    )}
                                  >
                                    <div className="min-w-0 flex-1 truncate">
                                      {chat.lastMessage?.senderId ===
                                        currentUserId && (
                                        <span className="font-medium text-foreground">
                                          You:{" "}
                                        </span>
                                      )}

                                      {chat.lastMessage?.text}
                                    </div>

                                    {chat.lastMessage?.senderId ===
                                      currentUserId && (
                                      <div className="flex shrink-0 items-center">
                                        {chat.lastMessage.seenAt ? (
                                          <CheckCheck className="h-3.5 w-3.5 text-blue-500" />
                                        ) : (
                                          <Check className="h-3.5 w-3.5 text-muted-foreground" />
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {chat.unreadCount > 0 && (
                                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 font-semibold text-foreground text-xs">
                                      {chat.unreadCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Button>
                          );
                        })
                      ) : (
                        <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-primary/10">
                            <div className="absolute inset-0 rounded-xl bg-primary/10 blur-lg" />

                            <Search
                              className="relative text-primary"
                              size={22}
                              strokeWidth={1.8}
                            />
                          </div>

                          <h3 className="mt-4 font-semibold text-foreground text-sm">
                            No chats found
                          </h3>

                          <p className="mt-1.5 max-w-[200px] text-muted-foreground text-xs leading-5">
                            We couldn&apos;t find any chat matching your search.
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                          <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl" />
                          <MessageCircle
                            className="relative text-primary"
                            size={28}
                          />
                        </div>

                        <h3 className="mt-4 font-semibold text-foreground text-sm">
                          No messages yet
                        </h3>

                        <p className="mt-1.5 max-w-[220px] text-muted-foreground text-xs leading-5">
                          It&apos;s quiet here. Send a message and start a
                          conversation ✨
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
              <div className="border-border/50 border-t px-4 py-3">
                <p className="text-muted-foreground text-xs">
                  {conversationList.length} Conversations
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
