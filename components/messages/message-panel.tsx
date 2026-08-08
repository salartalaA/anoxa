import { Loader2, Send, X } from "lucide-react";
import Image from "next/image";
import {
  type Dispatch,
  type SetStateAction,
  type SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  Conversation,
  OldMessages,
} from "@/app/(main)/messages/_messages.tsx";
import type { Message } from "@/app/generated/prisma/client";
import { socket } from "@/lib/socket";
import { formatLastSeen } from "@/lib/utils/format-last-seen";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import EmojiPickerPopOver from "./emoji-picker-popover";
import MessageItem from "./message-item";

interface NewMessage {
  conversationId: string;
  createdAt: Date;
  // receiverId: string;
  // seenAt: string | null;
  // senderId: string;
  text: string;
}

export default function MessagePanel({
  message,
  activeConversation,
  setPanelOpenState,
  setActiveConversation,
  setMessage,
  currentUserId,
  otherUserId,
  conversationId,
  oldMessages,
  onlineUsers,
  lastSeen,
  isTyping,
  setIsTyping,
}: {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  activeConversation: Conversation;
  setActiveConversation: Dispatch<SetStateAction<Conversation | null>>;
  setPanelOpenState: Dispatch<SetStateAction<boolean>>;
  currentUserId: string;
  otherUserId: string;
  conversationId: string;
  oldMessages: OldMessages | undefined;
  onlineUsers: string[];
  lastSeen: Record<string, Date>;
  isTyping: boolean;
  setIsTyping: Dispatch<SetStateAction<boolean>>;
}) {
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  const [isTypingFullName, setIsTypingFullName] = useState("");

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!oldMessages) {
      return;
    }

    setAllMessages(oldMessages.oldMessages);
    setIsLoadingMessages(false);
  }, [oldMessages]);

  useEffect(() => {
    socket.on("receive-new-message", (newMessage: Message) => {
      setAllMessages((prev) => [...prev, newMessage]);

      setIsLoadingMessages(false);
    });

    return () => {
      socket.off("receive-new-message");
    };
  }, []);

  useEffect(() => {
    const handleMessagesSeen = ({
      conversationId,
      messageId,
      seenAt,
    }: {
      conversationId: string;
      messageId: string;
      seenAt: string;
    }) => {
      setAllMessages((currentMessages) => {
        const targetMessage = currentMessages.find(
          (message) => message.id === messageId
        );

        if (!targetMessage) {
          return currentMessages;
        }

        const targetTime = new Date(targetMessage.createdAt).getTime();

        return currentMessages.map((message) => {
          const messageTime = new Date(message.createdAt).getTime();

          if (
            message.conversationId === conversationId &&
            message.senderId === currentUserId &&
            message.seenAt === null &&
            messageTime <= targetTime
          ) {
            return {
              ...message,
              seenAt: new Date(seenAt),
            };
          }

          return message;
        });
      });
    };

    socket.on("message-seen", handleMessagesSeen);

    return () => {
      socket.off("message-seen", handleMessagesSeen);
    };
  }, [currentUserId]);

  useEffect(() => {
    const handleStartUserTyping = ({
      userId,
      fullname,
    }: {
      userId: string;
      fullname: string;
    }) => {
      if (userId !== otherUserId) {
        return;
      }

      setIsTyping(true);
      setIsTypingFullName(fullname);
    };

    const handleStopUserTyping = ({ userId }: { userId: string }) => {
      if (userId !== otherUserId) {
        return;
      }

      setIsTyping(false);
    };

    socket.on("start-user-typing", handleStartUserTyping);
    socket.on("stop-user-typing", handleStopUserTyping);

    return () => {
      socket.off("start-user-typing", handleStartUserTyping);
      socket.off("stop-user-typing", handleStopUserTyping);
    };
  }, [otherUserId, setIsTyping]);

  useEffect(
    () => () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    },
    []
  );

  const handleSendNewMessage = (e: SyntheticEvent<Element, Event>) => {
    e.preventDefault();

    if (!message || message.trim() === "") {
      return null;
    }

    const newMessage: NewMessage = {
      text: message,
      // receiverId: otherUserId,
      // senderId: currentUserId,
      conversationId,
      createdAt: new Date(),
    };

    socket.emit("send-new-message", newMessage);

    setMessage("");
  };

  const isOnline = onlineUsers.includes(activeConversation.id);

  const currentLastSeen =
    lastSeen[activeConversation.id] ?? activeConversation.lastSeen;

  // const lastSeenTime = currentLastSeen
  //   ? new Date(currentLastSeen).toLocaleTimeString("en-US", {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       hour12: false,
  //     })
  //   : "";

  const handleTyping = () => {
    socket.emit("start-typing", {
      conversationId,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", {
        conversationId,
      });

      typingTimeoutRef.current = null;
    }, 1000);
  };

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
              {activeConversation.avatarURL ? (
                <Image
                  alt="user profile"
                  className="size-11 rounded-full"
                  height={11}
                  src={activeConversation.avatarURL}
                  width={11}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs">
                  {activeConversation.fullName.charAt(0)}
                </span>
              )}
            </div>

            {isOnline && (
              <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-card bg-success" />
            )}
          </div>

          <div>
            <p className="font-semibold text-foreground text-sm">
              {activeConversation.fullName}
            </p>

            <div className="flex items-center gap-1.5">
              <p className="text-muted-foreground text-xs">
                {/* {isOnline
                    ? "Online"
                    : `Last seen at ${formatLastSeen(currentLastSeen)}`} */}

                {isOnline && "Online"}

                {!isOnline && currentLastSeen && (
                  <>
                    {Date.now() - new Date(currentLastSeen).getTime() <
                      24 * 60 * 60 * 1000 &&
                      `Last seen at ${new Date(
                        currentLastSeen
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}`}

                    {Date.now() - new Date(currentLastSeen).getTime() >=
                      24 * 60 * 60 * 1000 &&
                      `Last seen ${formatLastSeen(currentLastSeen)}`}
                  </>
                )}

                {!(isOnline || currentLastSeen) && "Offline"}
              </p>
            </div>
          </div>
        </div>

        <Button
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {
            setAllMessages([]);
            setActiveConversation(null);
            setPanelOpenState(false);
          }}
          size="icon"
          variant="ghost"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="scrollbar-thin flex-1 overflow-hidden">
        {isLoadingMessages && (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-10 animate-spin text-primary" />
          </div>
        )}

        {allMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="font-medium text-foreground">No messages yet</p>

            <p className="mt-1 text-muted-foreground text-sm">
              Start the conversation by sending a message.
            </p>
          </div>
        ) : (
          <div className="space-y-1 px-5 py-6">
            {/* {allMessages.map((message: Message) => {
              const isMine = message.senderId === currentUserId;

              const time = new Date(message.createdAt).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }
              );

              return (
                <div
                  className={cn(
                    "mt-2.5 flex animate-message-in items-end gap-2.5",
                    isMine ? "justify-end" : "justify-start"
                  )}
                  key={message.id}
                >
                  {!isMine && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-semibold text-foreground text-xs">
                      {activeConversation.fullName.charAt(0)}
                    </div>
                  )}

                  <div
                    className={cn(
                      "flex max-w-[70%] flex-col",
                      isMine && "items-end"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                        isMine
                          ? "rounded-br-md bg-primary text-secondary-foreground"
                          : "rounded-bl-md bg-secondary text-secondary-foreground"
                      )}
                    >
                      {message.text}
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 px-1">
                      <span className="text-muted-foreground text-xs">
                        {time}
                      </span>

                      {isMine && (
                        <span className="text-muted-foreground/70 text-xs">
                          · delivered
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })} */}

            {allMessages.map((message: Message) => (
              <MessageItem
                currentUserId={currentUserId}
                key={message.id}
                message={message}
                otherUserFullName={activeConversation.fullName}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-border/50 border-t px-5 py-4">
        <form className="flex items-center gap-2.5">
          <Input
            className="flex-1 bg-background/50"
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            value={message}
          />

          <Button
            className="h-10 w-10 shrink-0"
            onClick={handleSendNewMessage}
            size="icon"
            type="submit"
          >
            <Send className="h-4 w-4" />
          </Button>

          {/* <EmojiPickerPopOver /> */}

          <EmojiPickerPopOver setMessage={setMessage} />
        </form>
        {isTyping && (
          <p className="mt-1 bg-transparent text-muted-foreground text-xs">
            {isTypingFullName} is typing ...
          </p>
        )}
      </div>
    </div>
  );
}
