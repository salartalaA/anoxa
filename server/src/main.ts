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

  const sessionId = cookies
    ?.split("; ")
    .find((item) => item.startsWith("session="))
    ?.split("=")[1];

  if (!sessionId) {
    return;
  }

  const currentUser = await getcurrentUserBySession(sessionId);

  if (!currentUser) {
    socket.disconnect();
    return;
  }

  // console.log(`${currentUser.id} is now Online!`);

  onlineUsers.set(socket.id, currentUser.id);

  io.emit("user-online", currentUser.id);

  socket.emit("online-users", { users: Array.from(onlineUsers.values()) });

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

    const oldMessages = await prisma.message.findMany({
      where: {
        conversationId: conversation.id,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    // console.log(
    //   `${openConversationData.currentUserId} wants chat with ${openConversationData.otherUserId}`
    // );

    // console.log(`Conversation ${conversation.id} opened!`);

    // console.log("Conversation Id: ", conversation.id);

    socket.emit("old-messages", {
      conversationId: conversation.id,
      oldMessages,
    });
  });

  socket.on("send-new-message", async (newMessage: NewMessage) => {
    // console.log("New message from server: ", newMessage);

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: newMessage.conversationId,
      },
    });

    if (!conversation) {
      return;
    }

    // console.log(newMessage);

    const receiverId =
      conversation.user1Id === newMessage.senderId
        ? conversation.user2Id
        : conversation.user1Id;

    const saveMessage = await prisma.message.create({
      data: {
        text: newMessage.text,
        conversationId: newMessage.conversationId,
        senderId: newMessage.senderId,
        receiverId,
      },
    });

    // console.log(saveMessage);

    if (!conversation) {
      return console.log("Something wrong!");
    }

    io.to(conversation.id).emit("receive-new-message", saveMessage);
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

  socket.on("disconnect", async () => {
    // console.log("Socket disconnected: ", socket.id);

    const userId = onlineUsers.get(socket.id);

    // console.log(`${userId} is now Offline!`);

    onlineUsers.delete(socket.id);

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
