"use server";

import { revalidatePath } from "next/cache";
import { requireActiveUser } from "@/actions/auth";
import type { Permission, Role } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";

export async function hasPermission(permission: Permission) {
  const result = await requireActiveUser();

  if (!result.success) {
    return false;
  }

  const currentUser = result.user;

  const checkPermission = await prisma.rolePermission.findUnique({
    where: {
      role_permission: {
        role: currentUser.role,
        permission,
      },
    },
  });

  return !!checkPermission;
}

export async function changeRole(role: Role, userId: string) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const hasPerm = await hasPermission("MANAGE_ROLES");

  if (!hasPerm) {
    return null;
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!targetUser) {
    return null;
  }

  if (targetUser.role === "OWNER") {
    return null;
  }

  const updatedUser = await prisma.user.update({
    data: {
      role,
    },
    where: {
      id: userId,
    },
  });

  revalidatePath("/admin/users");

  return updatedUser;
}

export async function deleteUser(userId: string) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const hasPerm = await hasPermission("DELETE_USER");

  if (!hasPerm) {
    return null;
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!targetUser) {
    return null;
  }

  if (targetUser.role === "OWNER") {
    return null;
  }

  const deletedUser = await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  revalidatePath("/admin/users");

  return deletedUser;
}
