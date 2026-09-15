import express from "express";
import "dotenv/config";
import http from "node:http";
import cors from "cors";
import { Server } from "socket.io";
import prisma from "../lib/prisma";
import type { NewMessage, OpenChat } from "../types";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// JUST FOR TEST

app.use("/users", async (_, res) => {
  // console.log(res.cookie);

  const allActiveUsers = await prisma.user.findMany({
    where: {
      status: "ACTIVE",
    },
    omit: {
      password: true,
    },
  });

  res.status(200).json(allActiveUsers);
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    credentials: true,
    origin: "http://localhost:3000",
  },
});

const activeConversationMap = new Map<string, string>();

async function getcurrentUserBySession(sessionId: string) {
  const result = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });

  if (!result) {
    return null;
  }

  return result.user;
}

const onlineUsers = new Map<string, string>();

io.on("connection", async (socket) => {
  // console.log("Socket connected: ", socket.id);

  const cookies = socket.handshake.headers.cookie;

  const sessionId =
    (socket.handshake.auth?.sessionId as string) ||
    cookies
      ?.split("; ")
      .find((item) => item.startsWith("session="))
      ?.split("=")[1];

  if (!sessionId) {
    console.log("Session ID nareseed, disconnecting...");
    socket.disconnect();
    return;
  }
  const currentUser = await getcurrentUserBySession(sessionId);

  if (!currentUser) {
    socket.disconnect();
    return;
  }

  // console.log(`${currentUser.id} is now Online!`);

  onlineUsers.set(socket.id, currentUser.id);

  socket.join(`user:${currentUser.id}`);

  io.emit("user-online", currentUser.id);

  socket.emit("online-users", {
    users: Array.from(onlineUsers.values()),
  });

  socket.on("open-chat", async (openConversationData: OpenChat) => {
    // console.log("BREAK");

    const chatUsers = [
      openConversationData.currentUserId,
      openConversationData.otherUserId,
    ].sort();

    let conversation = await prisma.conversation.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id: chatUsers[0],
          user2Id: chatUsers[1],
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user1Id: chatUsers[0],
          user2Id: chatUsers[1],
        },
      });
    }

    const oldConversation = activeConversationMap.get(socket.id);

    if (oldConversation) {
      socket.leave(oldConversation);
    }

    socket.join(conversation.id);

    activeConversationMap.set(socket.id, conversation.id);

    const lastUnreadMessage = await prisma.message.findFirst({
      where: {
        conversationId: conversation.id,
        receiverId: currentUser.id,
        seenAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (lastUnreadMessage) {
      const seenAt = new Date();

      await prisma.message.updateMany({
        where: {
          conversationId: conversation.id,
          receiverId: currentUser.id,
          seenAt: null,
          createdAt: {
            lte: lastUnreadMessage.createdAt,
          },
        },
        data: {
          seenAt,
        },
      });

      io.to(conversation.id).emit("message-seen", {
        conversationId: conversation.id,
        messageId: lastUnreadMessage.id,
        seenAt,
      });

      io.to(`user:${lastUnreadMessage.senderId}`).emit("message-seen", {
        conversationId: conversation.id,
        messageId: lastUnreadMessage.id,
        seenAt,
      });
    }

    const oldMessages = await prisma.message.findMany({
      where: {
        conversationId: conversation.id,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    socket.emit("old-messages", {
      conversationId: conversation.id,
      oldMessages,
    });
  });

  socket.on("message-seen", async ({ messageId }) => {
    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
      select: {
        id: true,
        conversationId: true,
        receiverId: true,
        createdAt: true,
      },
    });

    if (!message) {
      return;
    }

    if (message.receiverId !== currentUser.id) {
      return;
    }

    const seenAt = new Date();

    const result = await prisma.message.updateMany({
      where: {
        conversationId: message.conversationId,
        receiverId: currentUser.id,
        seenAt: null,
        createdAt: {
          lte: message.createdAt,
        },
      },

      data: {
        seenAt,
      },
    });

    if (result.count === 0) {
      return;
    }

    io.to(message.conversationId).emit("message-seen", {
      conversationId: message.conversationId,
      messageId: message.id,
      seenAt,
    });

    io.to(`user:${currentUser.id}`).emit("message-seen", {
      conversationId: message.conversationId,
      messageId: message.id,
      seenAt,
    });
  });

  socket.on("close-chat", () => {
    const conversationId = activeConversationMap.get(socket.id);

    if (!conversationId) {
      return;
    }

    socket.leave(conversationId);
    activeConversationMap.delete(socket.id);
  });

  socket.on("send-new-message", async (newMessage: NewMessage) => {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: newMessage.conversationId,
      },
    });

    if (!conversation) {
      return;
    }

    const senderId = currentUser.id;

    const receiverId =
      conversation.user1Id === senderId
        ? conversation.user2Id
        : conversation.user1Id;

    const saveMessage = await prisma.message.create({
      data: {
        text: newMessage.text,
        conversationId: newMessage.conversationId,
        senderId,
        receiverId,
      },
    });

    const unreadCount = await prisma.message.count({
      where: {
        conversationId: conversation.id,
        receiverId,
        seenAt: null,
      },
    });

    const receiverSockets = await io.in(`user:${receiverId}`).fetchSockets();

    const receiverIsInConversation = receiverSockets.some(
      (socket) => activeConversationMap.get(socket.id) === conversation.id
    );

    const finalUnreadCount = receiverIsInConversation ? 0 : unreadCount;

    const sender = await prisma.user.findUnique({
      where: {
        id: senderId,
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        avatarURL: true,
        lastSeen: true,
      },
    });

    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        avatarURL: true,
        lastSeen: true,
      },
    });

    io.to(conversation.id).emit("receive-new-message", saveMessage);

    io.to(`user:${senderId}`).emit("conversation-updated", {
      conversationId: conversation.id,
      lastMessage: saveMessage,
      unreadCount: 0,
      otherUser: receiver,
    });

    io.to(`user:${receiverId}`).emit("conversation-updated", {
      conversationId: conversation.id,
      lastMessage: saveMessage,
      unreadCount: finalUnreadCount,
      otherUser: sender,
    });
  });

  socket.on("start-typing", ({ conversationId }) =>
    socket.to(conversationId).emit("start-user-typing", {
      userId: currentUser.id,
      fullname: currentUser.fullName,
    })
  );

  socket.on("stop-typing", ({ conversationId }) =>
    socket.to(conversationId).emit("stop-user-typing", {
      userId: currentUser.id,
    })
  );

  socket.on("delete-message", async ({ messageId }) => {
    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      return;
    }

    if (message.senderId !== currentUser.id) {
      return;
    }

    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    const lastMessage = await prisma.message.findFirst({
      where: {
        conversationId: message.conversationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const unreadCount = await prisma.message.count({
      where: {
        conversationId: message.conversationId,
        receiverId: message.receiverId,
        seenAt: null,
      },
    });

    io.to(message.conversationId).emit("message-deleted", {
      messageId,
    });

    io.to(`user:${message.senderId}`).emit("conversation-updated", {
      conversationId: message.conversationId,
      lastMessage,
      unreadCount: 0,
    });

    io.to(`user:${message.receiverId}`).emit("conversation-updated", {
      conversationId: message.conversationId,
      lastMessage,
      unreadCount,
    });
  });

  socket.on("edit-message", async ({ messageId, messageText }) => {
    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      return;
    }

    if (message.senderId !== currentUser.id) {
      return;
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        text: messageText,
        isEdited: true,
      },
    });

    io.to(message.conversationId).emit("message-edited", {
      messageId: updatedMessage.id,
      messageText: updatedMessage.text,
      isEdited: true,
    });

    io.to(`user:${message.senderId}`).emit("conversation-updated", {
      conversationId: message.conversationId,
      lastMessage: updatedMessage,
    });

    io.to(`user:${message.receiverId}`).emit("conversation-updated", {
      conversationId: message.conversationId,
      lastMessage: updatedMessage,
    });
  });

  socket.on("disconnect", async () => {
    // console.log("Socket disconnected: ", socket.id);

    const userId = onlineUsers.get(socket.id);

    // console.log(`${userId} is now Offline!`);

    onlineUsers.delete(socket.id);

    if (!userId) {
      return;
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastSeen: new Date(),
      },
    });

    io.emit("user-offline", { userId, lastSeen: new Date() });
  });
});

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
