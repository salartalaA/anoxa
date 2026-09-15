import { ActivityIcon, Shield } from "lucide-react";
import Link from "next/link";
import { allActiveUsers, requireActiveUser } from "@/actions/auth";
import { getCurrentUserConversations } from "@/actions/messages";
import MessagesPage from "@/app/(main)/messages/_messages";
import NavItems from "@/components/sidebar/nav-items";

export default async function Messages() {
  const activeUsers = await allActiveUsers();

  const chats = await getCurrentUserConversations();

  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return;
  }

  const filteredActiveUsers = activeUsers?.filter(
    (user) => user.id !== currentUser.user.id
  );

  return (
    <>
      <div className="mx-4 flex items-center justify-between">
        <div className="flex h-16 items-center gap-2 lg:hidden">
          <Link className="flex items-center" href="/">
            <div className="flex w-full items-center gap-2">
              <span className="rounded-lg bg-blue-400 p-1 transition-transform duration-300 hover:scale-110">
                <ActivityIcon className="text-violet-800 max-md:size-5" />
              </span>
              <span className="font-semibold text-sm tracking-tight md:text-lg">
                <span className="text-white">AN</span>
                <span className="text-primary">OXA</span>
              </span>
            </div>
          </Link>
          {currentUser.user.role !== "USER" && (
            <Link href="/admin" prefetch>
              <Shield size={20} />
            </Link>
          )}
        </div>
        <div className="flex items-center lg:hidden">
          <NavItems />
        </div>
      </div>

      <MessagesPage
        // biome-ignore lint/style/noNonNullAssertion: No problem here
        activeUsers={filteredActiveUsers!}
        chats={chats ?? []}
        currentUserId={currentUser.user.id}
      />
    </>
  );
}
