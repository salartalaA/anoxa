import { ChevronRight, Plus, Search } from "lucide-react";
import Image from "next/image";
import { type Dispatch, type SetStateAction, useState } from "react";
import type { ConversationItem } from "@/app/(main)/messages/page";
import type { User } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "../ui/scroll-area";

type CustomUser = Omit<User, "password">;

export default function SendMessageDialog({
  setActiveConversation,
  setPanelOpenState,
  users,
}: {
  users: CustomUser[];
  setActiveConversation: Dispatch<SetStateAction<ConversationItem | null>>;
  setPanelOpenState: Dispatch<SetStateAction<boolean>>;
}) {
  const [openState, setOpenState] = useState(false);

  const handleOpenPanel = (user: any) => {
    setActiveConversation(user);
    setPanelOpenState(true);
    setOpenState(false);
  };

  return (
    <Dialog onOpenChange={setOpenState} open={openState}>
      <DialogTrigger
        render={
          <Button className={"rounded-lg text-foreground"}>
            <Plus size={16} />
            Send Message
          </Button>
        }
      />

      <DialogContent className="max-w-md border-border/60 bg-card p-6 sm:rounded-xl">
        <DialogTitle className="sr-only">Start new conversation</DialogTitle>

        <div className="flex flex-col gap-4">
          {/* Header */}
          <div>
            <h2 className="font-semibold text-foreground text-lg">
              Start new conversation
            </h2>
            <p className="mt-0.5 text-muted-foreground text-sm">
              Choose an active user to start chatting.
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              className="bg-background/50 pl-10"
              placeholder="Search users..."
            />
          </div>

          {/* Users */}
          <ScrollArea className="scrollbar-thin h-[320px] rounded-lg border border-border/50">
            <div className="p-2">
              {users.map((user) => (
                <Button
                  className="group flex h-auto w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200 hover:bg-accent/60 active:scale-[0.98]"
                  key={user.id}
                  onClick={() => {
                    handleOpenPanel(user);
                  }}
                  variant="ghost"
                >
                  <div className="relative shrink-0">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm text-white"
                      //   style={{ backgroundColor: user.avatarColor }}
                    >
                      {user.avatarURL ? (
                        <Image
                          alt="user profile"
                          className="rounded-full object-cover"
                          fill
                          src={user.avatarURL}
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs">
                          {user.fullName.charAt(0)}
                        </span>
                      )}
                    </div>
                    {/* 
                    {user.isOnline && (
                      <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
                    )} */}

                    <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground text-sm">
                      {user.fullName}
                    </p>

                    <p className="truncate text-muted-foreground text-xs">
                      @{user.username}
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
