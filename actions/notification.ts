"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./auth";

export async function getNotification() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  return await prisma.notification.findMany({
    where: {
      receiverId: currentUser.id,
    },
    include: {
      sender: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateNotificationIsRead(notificationId: string) {
  await prisma.notification.update({
    data: {
      isRead: true,
    },
    where: {
      id: notificationId,
    },
  });
}
