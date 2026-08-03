import { allActiveUsers } from "@/actions/auth";
import MessagesPage from "./_messages.tsx";

export interface ConversationItem {
  fullName: string;
  id: number;
  isOnline: boolean;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number | null;
}

export default async function Messages() {
  const activeUsers = await allActiveUsers();

  // biome-ignore lint/style/noNonNullAssertion: No problem here
  return <MessagesPage activeUsers={activeUsers!} />;
}
