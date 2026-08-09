"use server";

import prisma from "@/lib/prisma";
import { requireActiveUser } from "./auth";

export async function getCurrentUserConversations() {
  const result = await requireActiveUser();

  if (!result.success) {
    return;
  }

  const currentUser = result.user;

  const conversations = await prisma.conversation.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              user1Id: currentUser.id,
            },
            {
              user2Id: currentUser.id,
            },
          ],
        },
        {
          messages: {
            some: {},
          },
        },
      ],
    },
    include: {
      user1: true,
      user2: true,
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },

      _count: {
        select: {
          messages: {
            where: {
              receiverId: currentUser.id,
              seenAt: null,
            },
          },
        },
      },
    },
  });

  const chats = conversations.map((conversation) => {
    const receiver =
      conversation.user1Id === currentUser.id
        ? conversation.user2
        : conversation.user1;

    const lastMessage = conversation.messages[0];

    return {
      id: receiver.id,

      conversationId: conversation.id,

      fullName: receiver.fullName,

      username: receiver.username,

      avatarURL: receiver.avatarURL,

      lastMessage,

      lastMessageAt: lastMessage?.createdAt ?? null,

      lastSeen: receiver.lastSeen,

      unreadCount: conversation._count.messages ?? 0,

      currentUserId: currentUser.id,
    };
  });

  return chats.sort((a, b) => {
    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;

    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;

    return bTime - aTime;
  });
}
