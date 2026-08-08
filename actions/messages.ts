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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return conversations.map((conversation) => {
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

      unreadCount: null,
    };
  });
}
