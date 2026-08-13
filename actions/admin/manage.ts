"use server";

import { revalidatePath } from "next/cache";
import { hasPermission } from "@/actions/admin/role";
import { requireActiveUser } from "@/actions/auth";
import prisma from "@/lib/prisma";

export async function suspendUser(userId: string) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const checkPerm = await hasPermission("SUSPEND_USER");

  if (!checkPerm) {
    return null;
  }

  const existingTarget = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (
    !(existingTarget && existingTarget.status === "ACTIVE") ||
    existingTarget.role === "OWNER"
  ) {
    return null;
  }

  await prisma.user.update({
    data: {
      status: "SUSPENDED",
    },
    where: {
      id: userId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function banUser(userId: string) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const checkPerm = await hasPermission("BAN_USER");

  if (!checkPerm) {
    return null;
  }

  const existingTarget = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (
    !existingTarget ||
    existingTarget.status === "BANNED" ||
    existingTarget.role === "OWNER"
  ) {
    return null;
  }

  await prisma.user.update({
    data: {
      status: "BANNED",
    },
    where: {
      id: userId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function unsuspendUser(userId: string) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const checkPerm = await hasPermission("UNSUSPEND_USER");

  if (!checkPerm) {
    return null;
  }

  const existingTarget = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!(existingTarget && existingTarget.status === "SUSPENDED")) {
    return null;
  }

  await prisma.user.update({
    data: {
      status: "ACTIVE",
    },
    where: {
      id: userId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function unbanUser(userId: string) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const checkPerm = await hasPermission("UNBAN_USER");

  if (!checkPerm) {
    return null;
  }

  const existingTarget = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!(existingTarget && existingTarget.status === "BANNED")) {
    return null;
  }

  await prisma.user.update({
    data: {
      status: "ACTIVE",
    },
    where: {
      id: userId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
}
