import { allActiveUsers, requireActiveUser } from "@/actions/auth";
import { getCurrentUserConversations } from "@/actions/messages";
import MessagesPage from "./_messages.tsx";

export default async function Messages() {
  const activeUsers = await allActiveUsers();

  const chats = await getCurrentUserConversations();

  // console.log(chats);

  const currentUser = await requireActiveUser();

  if (!currentUser.success) {
    return;
  }

  const filteredActiveUsers = activeUsers?.filter(
    (user) => user.id !== currentUser.user.id
  );

  return (
    <MessagesPage
      // biome-ignore lint/style/noNonNullAssertion: No problem here
      activeUsers={filteredActiveUsers!}
      chats={chats ?? []}
      currentUserId={currentUser.user.id}
    />
  );
}
