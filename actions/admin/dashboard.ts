import prisma from "@/lib/prisma";
import { requireActiveUser } from "../auth";

export async function dashboardStats() {
  const [
    totalUsers,
    activeUsers,
    totalPosts,
    pendingPostReports,
    pendingCommentReports,
    verifiesUsers,
    suspendedUsers,
    bannedUsers,
    totalComments,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.post.count(),

    prisma.postReport.count({
      where: {
        reportStatus: "PENDING",
      },
    }),

    prisma.commentReport.count({
      where: {
        reportStatus: "PENDING",
      },
    }),

    prisma.user.count({
      where: {
        isVerified: true,
      },
    }),

    prisma.user.count({
      where: {
        status: "SUSPENDED",
      },
    }),

    prisma.user.count({
      where: {
        status: "BANNED",
      },
    }),

    prisma.comment.count(),
  ]);

  return {
    totalUsers,
    activeUsers,
    totalPosts,
    pendingReports: pendingPostReports + pendingCommentReports,
    verifiesUsers,
    suspendedUsers,
    bannedUsers,
    totalComments,
  };
}

export interface PlatformActivity {
  comments: number;
  date: string;
  posts: number;
  users: number;
}

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function countByDay(dates: Date[]) {
  return dates.reduce<Record<string, number>>((acc, date) => {
    const key = getDateKey(date);

    acc[key] = (acc[key] ?? 0) + 1;

    return acc;
  }, {});
}

export async function getPlatformActivity(): Promise<PlatformActivity[]> {
  const now = new Date();

  const endDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );

  const startDate = new Date(endDate);

  startDate.setUTCDate(startDate.getUTCDate() - 7);

  const [users, posts, comments] = await Promise.all([
    prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        createdAt: true,
      },
    }),

    prisma.post.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        createdAt: true,
      },
    }),

    prisma.comment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        createdAt: true,
      },
    }),
  ]);

  const usersByDay = countByDay(users.map((user) => user.createdAt));

  const postsByDay = countByDay(posts.map((post) => post.createdAt));

  const commentsByDay = countByDay(
    comments.map((comment) => comment.createdAt)
  );

  const activity: PlatformActivity[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);

    date.setUTCDate(date.getUTCDate() + i);

    const dateKey = getDateKey(date);

    activity.push({
      date: new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        timeZone: "UTC",
      }).format(date),

      users: usersByDay[dateKey] ?? 0,
      posts: postsByDay[dateKey] ?? 0,
      comments: commentsByDay[dateKey] ?? 0,
    });
  }

  return activity;
}

export async function recentSignups() {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const currentUser = result.user;

  if (currentUser.role === "USER") {
    return null;
  }

  const lastFiveUsers = await prisma.user.findMany({
    omit: {
      password: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return lastFiveUsers;
}
